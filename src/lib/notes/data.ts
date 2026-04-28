import { cache } from "react";
import type { Database } from "@/lib/database.types";
import {
  type JournalSpace,
  notes as mockNotes,
  type JournalCategory,
  type Note,
} from "@/content/site";
import { hasSupabaseEnv, isProductionRuntime } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

type NoteWithPhotos = NoteRow & {
  photos: PhotoRow[];
};

function resolveStorageUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl) {
    return path;
  }

  return `${projectUrl}/storage/v1/object/public/uploads/${path}`;
}

function normalizeSlugCandidate(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function shouldUseMockContent() {
  return !hasSupabaseEnv() && !isProductionRuntime();
}

function estimateReadTime(content: string) {
  const words = stripMarkup(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min`;
}

function formatLocation(content: string) {
  const match = content.match(/上海|杭州|京都|东京|巴黎|香港|冰岛/);
  return match?.[0] ?? "未设置";
}

function resolveJournalCategory(note: NoteRow): JournalCategory {
  if (note.journal_category === "life" || note.journal_category === "study" || note.journal_category === "fragment") {
    return note.journal_category;
  }

  const text = `${note.title} ${note.excerpt ?? ""} ${note.content}`.toLowerCase();
  if (/学习|读书|阅读|设计|系统|react|代码|研究|笔记/.test(text)) {
    return "study";
  }

  if ((note.excerpt ?? "").length <= 40 || note.content.length <= 120) {
    return "fragment";
  }

  return "life";
}

function resolveJournalSpace(note: NoteRow): JournalSpace {
  if (note.journal_space === "journals") {
    return "journals";
  }

  return "photo_notes";
}

function mapDbNote(note: NoteWithPhotos): Note {
  const sortedPhotos = [...note.photos].sort((a, b) => a.sort_order - b.sort_order);
  const journalSpace = note.entry_type === "journal" ? resolveJournalSpace(note) : undefined;
  const resolvedCover = resolveStorageUrl(note.cover_photo_url);
  const firstPhoto = resolveStorageUrl(sortedPhotos[0]?.storage_path);
  const fallbackCover =
    "https://images.unsplash.com/photo-1691358364902-1fcc05d2df3e?auto=format&fit=crop&w=1200&q=80";
  const useFallbackForJournal = note.entry_type === "journal" && journalSpace === "journals";
  const coverSource = resolvedCover
    ? "explicit"
    : firstPhoto
      ? "photo"
      : "fallback";
  const coverImage = resolvedCover || firstPhoto || (useFallbackForJournal ? fallbackCover : fallbackCover);

  return {
    id: note.id,
    entryType: note.entry_type,
    journalSpace,
    journalCategory:
      note.entry_type === "journal" && journalSpace === "journals"
        ? resolveJournalCategory(note)
        : undefined,
    slug: note.slug,
    title: note.title,
    excerpt: note.excerpt ?? "",
    content: note.content,
    date: note.created_at,
    location: note.location?.trim() || formatLocation(note.content),
    shotAt: note.shot_at ?? undefined,
    readTime: estimateReadTime(note.content),
    coverImage,
    coverSource,
    imageAspect: "4 / 5.4",
    camera: note.camera?.trim() || "参数无",
    aperture: note.aperture?.trim() || "参数无",
    shutterSpeed: note.shutter_speed?.trim() || "参数无",
    iso: note.iso?.trim() || "参数无",
    status: note.status,
    photos: sortedPhotos.map((photo) => ({
      id: photo.id,
      src: resolveStorageUrl(photo.storage_path) ?? photo.storage_path,
      storagePath: photo.storage_path,
      alt: note.title,
      caption: photo.caption ?? undefined,
    })),
  };
}

async function fetchDbNotes(status?: "draft" | "published") {
  const supabase = await createClient();
  let query = supabase
    .from("notes")
    .select("*, photos(*)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as NoteWithPhotos[]).map(mapDbNote);
}

export const getPublishedNotes = cache(async () => {
  if (shouldUseMockContent()) {
    return mockNotes
      .filter((note) => note.status === "published")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  try {
    return await fetchDbNotes("published");
  } catch {
    if (isProductionRuntime()) {
      return [];
    }

    return mockNotes
      .filter((note) => note.status === "published")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
});

export const getPublishedPhotos = cache(async () => {
  const notes = await getPublishedNotes();
  return notes.filter((note) => note.entryType === "photo");
});

export const getPublishedJournals = cache(async () => {
  const notes = await getPublishedNotes();
  return notes.filter((note) => note.entryType === "journal" && note.journalSpace === "journals");
});

export const getPublishedPhotoNotes = cache(async () => {
  const notes = await getPublishedNotes();
  return notes.filter((note) => note.entryType === "journal" && note.journalSpace === "photo_notes");
});

export const getAdminNotes = cache(async () => {
  if (shouldUseMockContent()) {
    return [...mockNotes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  try {
    return await fetchDbNotes();
  } catch {
    if (isProductionRuntime()) {
      return [];
    }

    return [...mockNotes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
});

export const getNoteBySlug = cache(async (slug: string) => {
  const decodedSlug = normalizeSlugCandidate(slug);
  const slugCandidates = Array.from(new Set([slug, decodedSlug]));

  if (shouldUseMockContent()) {
    return mockNotes.find((note) => slugCandidates.includes(note.slug));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*, photos(*)")
      .in("slug", slugCandidates)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      const publishedNotes = await fetchDbNotes("published").catch(() => []);
      return (
        publishedNotes.find((note) => slugCandidates.includes(note.slug)) ??
        (isProductionRuntime() ? undefined : mockNotes.find((note) => slugCandidates.includes(note.slug)))
      );
    }

    return mapDbNote(data as NoteWithPhotos);
  } catch {
    if (isProductionRuntime()) {
      return undefined;
    }

    return mockNotes.find((note) => slugCandidates.includes(note.slug));
  }
});

export const getAdminNoteById = cache(async (id: string) => {
  if (shouldUseMockContent()) {
    return mockNotes.find((note) => note.id === id);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*, photos(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return isProductionRuntime() ? undefined : mockNotes.find((note) => note.id === id);
    }

    return mapDbNote(data as NoteWithPhotos);
  } catch {
    if (isProductionRuntime()) {
      return undefined;
    }

    return mockNotes.find((note) => note.id === id);
  }
});
