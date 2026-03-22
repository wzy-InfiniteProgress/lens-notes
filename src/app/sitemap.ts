import type { MetadataRoute } from "next";
import { notes, siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedNotes = notes.filter((note) => note.status === "published");

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...publishedNotes.map((note) => ({
      url: `${siteConfig.url}/notes/${note.slug}`,
      lastModified: new Date(note.date),
      changeFrequency: "monthly" as const,
      priority: note.entryType === "photo" ? 0.8 : 0.7,
    })),
  ];
}
