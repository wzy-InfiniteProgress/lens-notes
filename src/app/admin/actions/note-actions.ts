"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAdminUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePhotoField(value: string) {
  return value.trim() || "参数无";
}

function normalizeJournalCategory(value: string) {
  if (value === "study" || value === "fragment") {
    return value;
  }

  return "life";
}

function normalizeJournalSpace(value: string) {
  if (value === "photo_notes") {
    return value;
  }

  return "journals";
}

function parsePhotosPayload(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Array<{
      storagePath?: string;
      caption?: string;
    }>;

    return parsed
      .filter((photo) => photo.storagePath)
      .map((photo, index) => ({
        storage_path: String(photo.storagePath),
        caption: photo.caption ? String(photo.caption) : null,
        sort_order: index,
      }));
  } catch {
    return [];
  }
}

function buildSchemaHintMessage(message: string) {
  if (message.includes("journal_category") || message.includes("journal_space")) {
    return "数据库还没有完成随笔字段初始化，请先在 Supabase 执行 supabase/2026-04-05-journal-fields.sql。";
  }

  return message;
}

function buildPublishedPath(entryType: "photo" | "journal", journalSpace: "photo_notes" | "journals", slug: string) {
  const encodedSlug = encodeURIComponent(slug);

  if (entryType === "photo") {
    return `/notes/${encodedSlug}`;
  }

  if (journalSpace === "journals") {
    return `/journals/${encodedSlug}`;
  }

  return `/notes/${encodedSlug}`;
}

export async function upsertNoteAction(formData: FormData) {
  const { user, previewMode } = await requireAdminUser("/admin");

  if (previewMode || !user || !hasSupabaseEnv()) {
    redirect("/admin?preview=1");
  }

  const id = normalizeText(formData.get("id"));
  const title = normalizeText(formData.get("title"));
  const inputSlug = normalizeText(formData.get("slug"));
  const slug = slugify(inputSlug || title);
  const entryType = normalizeText(formData.get("entryType")) === "photo" ? "photo" : "journal";
  const journalSpace = normalizeJournalSpace(normalizeText(formData.get("journalSpace")));
  const journalCategory = normalizeJournalCategory(normalizeText(formData.get("journalCategory")));
  const excerpt = normalizeText(formData.get("excerpt"));
  const content = normalizeText(formData.get("content"));
  const coverPhotoUrl = normalizeText(formData.get("coverPhotoUrl"));
  const location = normalizeText(formData.get("location"));
  const shotAt = normalizeText(formData.get("shotAt"));
  const camera = normalizeText(formData.get("camera"));
  const aperture = normalizeText(formData.get("aperture"));
  const shutterSpeed = normalizeText(formData.get("shutterSpeed"));
  const iso = normalizeText(formData.get("iso"));
  const status = normalizeText(formData.get("status")) === "published" ? "published" : "draft";
  const photosPayload = parsePhotosPayload(formData.get("photosPayload"));
  const plainContent =
    entryType === "journal" && journalSpace === "journals" ? stripMarkup(content) : content.trim();

  if (!title || !slug || !plainContent) {
    const message = encodeURIComponent("标题、Slug 和正文不能为空");
    redirect(id ? `/admin/edit/${id}?error=${message}` : `/admin/new?error=${message}`);
  }

  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    entry_type: entryType,
    journal_space: entryType === "journal" ? journalSpace : null,
    journal_category: entryType === "journal" && journalSpace === "journals" ? journalCategory : null,
    title,
    slug,
    excerpt: excerpt || (entryType === "journal" ? plainContent.slice(0, 110) : null),
    content,
    cover_photo_url: coverPhotoUrl || null,
    location: location || null,
    shot_at: shotAt || null,
    camera: entryType === "photo" ? normalizePhotoField(camera) : null,
    aperture: entryType === "photo" ? normalizePhotoField(aperture) : null,
    shutter_speed: entryType === "photo" ? normalizePhotoField(shutterSpeed) : null,
    iso: entryType === "photo" ? normalizePhotoField(iso) : null,
    status,
  };

  if (id) {
    const { error } = await supabase.from("notes").update(payload).eq("id", id).eq("user_id", user.id);
    if (error) {
      redirect(`/admin/edit/${id}?error=${encodeURIComponent(buildSchemaHintMessage(error.message))}`);
    }

    await supabase.from("photos").delete().eq("note_id", id).eq("user_id", user.id);
    if (photosPayload.length) {
      const { error: photosError } = await supabase.from("photos").insert(
        photosPayload.map((photo) => ({
          ...photo,
          note_id: id,
          user_id: user.id,
        })),
      );
      if (photosError) {
        redirect(`/admin/edit/${id}?error=${encodeURIComponent(buildSchemaHintMessage(photosError.message))}`);
      }
    }

    revalidatePath(`/notes/${slug}`);
    revalidatePath(`/journals/${slug}`);
    revalidatePath("/journals");
    revalidatePath("/admin");
    revalidatePath("/");
    if (status === "published") {
      redirect(buildPublishedPath(entryType, journalSpace, slug));
    }
    redirect(`/admin/edit/${id}?saved=1`);
  }

  const { data, error } = await supabase.from("notes").insert(payload).select("id").single();
  if (error || !data) {
    redirect(
      `/admin/new?error=${encodeURIComponent(
        buildSchemaHintMessage(error?.message ?? "保存失败"),
      )}`,
    );
  }

  if (photosPayload.length) {
    const { error: photosError } = await supabase.from("photos").insert(
      photosPayload.map((photo) => ({
        ...photo,
        note_id: data.id,
        user_id: user.id,
      })),
    );
    if (photosError) {
      redirect(`/admin/edit/${data.id}?error=${encodeURIComponent(buildSchemaHintMessage(photosError.message))}`);
    }
  }

  revalidatePath(`/notes/${slug}`);
  revalidatePath(`/journals/${slug}`);
  revalidatePath("/journals");
  revalidatePath("/");
  revalidatePath("/admin");
  if (status === "published") {
    redirect(buildPublishedPath(entryType, journalSpace, slug));
  }
  redirect(`/admin/edit/${data.id}?created=1`);
}

export async function deleteNoteAction(formData: FormData) {
  const { user, previewMode } = await requireAdminUser("/admin");

  if (previewMode || !user || !hasSupabaseEnv()) {
    redirect("/admin?preview=1");
  }

  const id = normalizeText(formData.get("id"));
  if (!id) {
    redirect("/admin");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    redirect(`/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/journals");
  revalidatePath("/admin");
  redirect("/admin?deleted=1&deletedCount=1");
}

export async function deleteSelectedNotesAction(formData: FormData) {
  const { user, previewMode } = await requireAdminUser("/admin");

  if (previewMode || !user || !hasSupabaseEnv()) {
    redirect("/admin?preview=1");
  }

  const ids = formData
    .getAll("selectedIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!ids.length) {
    redirect("/admin?error=请选择要删除的内容");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("user_id", user.id).in("id", ids);

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/journals");
  revalidatePath("/admin");
  redirect(`/admin?deleted=1&deletedCount=${ids.length}`);
}
