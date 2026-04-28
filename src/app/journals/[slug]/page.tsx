import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { MarkdownContent } from "@/components/markdown-content";
import { NoteMeta } from "@/components/note-meta";
import { getNoteBySlug, getPublishedJournals } from "@/lib/notes/data";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholders";

type JournalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: JournalDetailPageProps) {
  const { slug: rawSlug } = await params;
  const slug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();
  const note = await getNoteBySlug(slug);

  if (!note || note.entryType !== "journal" || note.journalSpace !== "journals") {
    return {};
  }

  return {
    title: `${note.title} | 随笔 | Lens Notes`,
    description: note.excerpt,
  };
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { slug: rawSlug } = await params;
  const slug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();
  const [note, publishedJournals] = await Promise.all([getNoteBySlug(slug), getPublishedJournals()]);
  const resolvedNote = note?.entryType === "journal" && note.journalSpace === "journals"
    ? note
    : publishedJournals.find((item) => item.slug === slug);

  if (!resolvedNote || resolvedNote.entryType !== "journal" || resolvedNote.journalSpace !== "journals") {
    notFound();
  }

  const hasHeroImage = resolvedNote.coverSource !== "fallback" || resolvedNote.photos.length > 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fcfcfd_40%,_#ffffff_100%)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/journals"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          返回手记页
        </Link>

        <article className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div
            className={`relative overflow-hidden px-6 py-16 sm:px-10 sm:py-24 ${
              hasHeroImage
                ? "min-h-[27rem]"
                : "bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.42),transparent_44%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,0.98))]"
            }`}
          >
            {hasHeroImage ? (
              <>
                <Image
                  src={resolvedNote.coverImage}
                  alt={resolvedNote.title}
                  fill
                  sizes="100vw"
                  quality={70}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover opacity-65 scale-[1.05]"
                  priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.72)_56%,rgba(255,255,255,0.92))]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(248,250,252,0.98))]" />
            )}
            <div className="relative mx-auto max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Journal Detail</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                {resolvedNote.title}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
                {resolvedNote.excerpt}
              </p>
              <div className="mt-8 flex justify-center">
                <NoteMeta
                  date={resolvedNote.date}
                  location={resolvedNote.location}
                  readTime={resolvedNote.readTime}
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-16">
              <div className="mx-auto mb-10 max-w-3xl rounded-[1.75rem] border border-slate-200 bg-slate-50/80 px-6 py-5 text-sm leading-8 text-slate-600 shadow-sm">
                这里收纳的是更偏生活、学习和片段性的文字。图像不再承担主叙事，而是轻轻托住当时的气味、节奏和留白。
              </div>

            {resolvedNote.content.trim().startsWith("<") ? (
              <div
                className="rich-journal-content"
                dangerouslySetInnerHTML={{ __html: resolvedNote.content }}
              />
            ) : (
              <MarkdownContent content={resolvedNote.content} variant="journal" />
            )}

            {resolvedNote.photos.length > 0 ? (
              <section className="mt-16 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">手记配图</h2>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <figure className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={resolvedNote.photos[0].src}
                      alt={resolvedNote.photos[0].alt}
                      fill
                      sizes="100vw"
                      quality={70}
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </div>
                  {resolvedNote.photos[0].caption ? (
                    <figcaption className="px-6 py-5 text-base leading-8 text-slate-600">
                      {resolvedNote.photos[0].caption}
                    </figcaption>
                  ) : null}
                </figure>

                {resolvedNote.photos.length > 1 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {resolvedNote.photos.slice(1).map((photo, index) => (
                      <figure
                        key={photo.id}
                        className={`overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50 shadow-sm ${
                          index % 3 === 1 ? "sm:translate-y-6" : ""
                        }`}
                      >
                        <div className="relative aspect-[4/4.8]">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={68}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover"
                          />
                        </div>
                        {photo.caption ? (
                          <figcaption className="px-5 py-4 text-sm leading-7 text-slate-600">
                            {photo.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>
        </article>
      </main>
    </div>
  );
}
