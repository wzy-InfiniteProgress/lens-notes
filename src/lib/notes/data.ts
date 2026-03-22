import { cache } from "react";
import type { Database } from "@/lib/database.types";
import { notes as mockNotes, type Note } from "@/content/site";
import { hasSupabaseEnv } from "@/lib/env";
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

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min`;
}

function formatLocation(content: string) {
  const match = content.match(/上海|杭州|京都|东京|巴黎|香港|冰岛/);
  return match?.[0] ?? "未设置";
}

function mapDbNote(note: NoteWithPhotos): Note {
  const sortedPhotos = [...note.photos].sort((a, b) => a.sort_order - b.sort_order);
  const resolvedCover = resolveStorageUrl(note.cover_photo_url);
  const coverImage =
    resolvedCover ||
    resolveStorageUrl(sortedPhotos[0]?.storage_path) ||
    "https://images.unsplash.com/photo-1691358364902-1fcc05d2df3e?auto=format&fit=crop&w=1200&q=80";

  return {
    id: note.id,
    entryType: note.entry_type,
    slug: note.slug,
    title: note.title,
    excerpt: note.excerpt ?? "",
    content: note.content,
    date: note.created_at,
    location: note.location?.trim() || formatLocation(note.content),
    shotAt: note.shot_at ?? undefined,
    readTime: estimateReadTime(note.content),
    coverImage,
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
  if (!hasSupabaseEnv()) {
    return mockNotes
      .filter((note) => note.status === "published")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  try {
    return await fetchDbNotes("published");
  } catch {
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
  return notes.filter((note) => note.entryType === "journal");
});

export const getAdminNotes = cache(async () => {
  if (!hasSupabaseEnv()) {
    return [...mockNotes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  try {
    return await fetchDbNotes();
  } catch {
    return [...mockNotes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
});

export const getNoteBySlug = cache(async (slug: string) => {
  if (!hasSupabaseEnv()) {
    return mockNotes.find((note) => note.slug === slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*, photos(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      const publishedNotes = await fetchDbNotes("published").catch(() => []);
      return (
        publishedNotes.find((note) => note.slug === slug) ??
        mockNotes.find((note) => note.slug === slug)
      );
    }

    return mapDbNote(data as NoteWithPhotos);
  } catch {
    return mockNotes.find((note) => note.slug === slug);
  }
});

export const getAdminNoteById = cache(async (id: string) => {
  if (!hasSupabaseEnv()) {
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
      return mockNotes.find((note) => note.id === id);
    }

    return mapDbNote(data as NoteWithPhotos);
  } catch {
    return mockNotes.find((note) => note.id === id);
  }
});
