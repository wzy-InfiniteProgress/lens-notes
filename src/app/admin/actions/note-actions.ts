"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAdminUser } from "@/lib/auth/session";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizePhotoField(value: string) {
  return value.trim() || "参数无";
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

export async function upsertNoteAction(formData: FormData) {
  const { user, previewMode } = await requireAdminUser("/admin");

  if (previewMode || !user || !hasSupabaseEnv()) {
    redirect("/admin?preview=1");
  }

  const id = normalizeText(formData.get("id"));
  const title = normalizeText(formData.get("title"));
  const slug = normalizeText(formData.get("slug"));
  const entryType = normalizeText(formData.get("entryType")) === "photo" ? "photo" : "journal";
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

  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    entry_type: entryType,
    title,
    slug,
    excerpt: excerpt || null,
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
      redirect(`/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
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
        redirect(`/admin/edit/${id}?error=${encodeURIComponent(photosError.message)}`);
      }
    }

    revalidatePath(`/notes/${slug}`);
    revalidatePath("/admin");
    revalidatePath("/");
    redirect("/admin?saved=1");
  }

  const { data, error } = await supabase.from("notes").insert(payload).select("id").single();
  if (error || !data) {
    redirect(`/admin/new?error=${encodeURIComponent(error?.message ?? "保存失败")}`);
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
      redirect(`/admin/edit/${data.id}?error=${encodeURIComponent(photosError.message)}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?created=1");
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
  revalidatePath("/admin");
  redirect(`/admin?deleted=1&deletedCount=${ids.length}`);
}
