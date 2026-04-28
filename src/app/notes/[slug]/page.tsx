import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { MarkdownContent } from "@/components/markdown-content";
import { NoteMeta } from "@/components/note-meta";
import { getNoteBySlug, getPublishedNotes } from "@/lib/notes/data";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholders";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: NotePageProps) {
  const { slug: rawSlug } = await params;
  const slug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {};
  }

  return {
    title: `${note.title} | Lens Notes`,
    description: note.excerpt,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug: rawSlug } = await params;
  const slug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();
  const [note, publishedNotes] = await Promise.all([getNoteBySlug(slug), getPublishedNotes()]);
  const resolvedNote = note ?? publishedNotes.find((item) => item.slug === slug);
  const isPhoto = resolvedNote?.entryType === "photo";

  if (!resolvedNote) {
    notFound();
  }

  if (resolvedNote.entryType === "journal" && resolvedNote.journalSpace === "journals") {
    redirect(`/journals/${resolvedNote.slug}`);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fcfcfd_40%,_#ffffff_100%)]">
      <Header />
      <main className={`mx-auto px-4 pb-20 pt-8 sm:px-6 lg:px-8 ${isPhoto ? "max-w-5xl" : "max-w-6xl"}`}>
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
        {isPhoto ? (
          <article className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-slate-950">
              <Image
                src={resolvedNote.coverImage}
                alt={resolvedNote.title}
                fill
                sizes="100vw"
                quality={72}
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                className="object-cover opacity-25 blur-2xl scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-slate-950/45" />
              <Image
                src={resolvedNote.coverImage}
                alt={resolvedNote.title}
                width={1800}
                height={1400}
                sizes="(max-width: 768px) 100vw, 1100px"
                quality={78}
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                className="relative z-10 h-auto max-h-[78vh] w-auto max-w-full object-contain shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                priority
              />
            </div>

            <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Photo Detail</p>
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                    {resolvedNote.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-slate-600">{resolvedNote.excerpt}</p>
                  <NoteMeta
                    date={resolvedNote.date}
                    location={resolvedNote.location}
                    readTime={resolvedNote.readTime}
                  />
                </div>

                <MarkdownContent content={resolvedNote.content} variant="photo" />

                {resolvedNote.photos.length > 0 ? (
                  <section className="space-y-5 pt-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">延伸图集</h2>
                    <div className="grid gap-5">
                      {resolvedNote.photos.map((photo) => (
                        <figure
                          key={photo.id}
                          className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950"
                        >
                          <div className="relative flex min-h-[24rem] items-center justify-center">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="100vw"
                              quality={55}
                              placeholder="blur"
                              blurDataURL={IMAGE_BLUR_DATA_URL}
                              className="object-cover opacity-18 blur-2xl scale-110"
                            />
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              width={1600}
                              height={1200}
                              sizes="(max-width: 768px) 100vw, 900px"
                              quality={76}
                              placeholder="blur"
                              blurDataURL={IMAGE_BLUR_DATA_URL}
                              className="relative z-10 h-auto max-h-[78vh] w-auto max-w-full object-contain"
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
                  </section>
                ) : null}
              </div>

              <aside className="lg:pt-24">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5 shadow-sm lg:sticky lg:top-24">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Capture Info</p>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">相机</p>
                      <p className="mt-1 font-medium text-slate-900">{resolvedNote.camera}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">光圈</p>
                      <p className="mt-1 font-medium text-slate-900">{resolvedNote.aperture}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">快门</p>
                      <p className="mt-1 font-medium text-slate-900">{resolvedNote.shutterSpeed}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ISO</p>
                      <p className="mt-1 font-medium text-slate-900">{resolvedNote.iso}</p>
                    </div>
                    <p className="rounded-2xl bg-white px-4 py-3 text-slate-500">
                      共 {resolvedNote.photos.length} 张延伸图片
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        ) : (
          <article className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="relative min-h-[27rem] overflow-hidden px-6 py-16 sm:px-10 sm:py-24">
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
                这篇手记会把图像当作情绪的延展，而不是信息主角。正文先完整地把当天的感受落下来，配图再慢慢把场景托住。
              </div>

              <MarkdownContent content={resolvedNote.content} variant="journal" />

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
        )}
      </main>
    </div>
  );
}
