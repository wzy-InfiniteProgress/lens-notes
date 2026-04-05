import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { EditorialNotes } from "@/components/editorial-notes";
import { Header } from "@/components/header";
import { NoteMasonry } from "@/components/note-masonry";
import {
  getPublishedJournals,
  getPublishedNotes,
  getPublishedPhotoNotes,
  getPublishedPhotos,
} from "@/lib/notes/data";

export default async function HomePage() {
  const [publishedNotes, publishedPhotos, publishedPhotoNotes, publishedJournals] = await Promise.all([
    getPublishedNotes(),
    getPublishedPhotos(),
    getPublishedPhotoNotes(),
    getPublishedJournals(),
  ]);
  const featured = publishedNotes[0];
  const featuredHref =
    featured?.entryType === "journal" && featured.journalSpace === "journals"
      ? `/journals/${featured.slug}`
      : featured
        ? `/notes/${featured.slug}`
        : "#notes";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_32%),radial-gradient(circle_at_85%_12%,_rgba(226,232,240,0.75),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#f4f4f5_48%,_#ffffff_100%)]">
      <Header />
      <main className="pb-20">
        <section className="relative mx-auto flex min-h-[84vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="hero-kicker mb-6 text-sm text-slate-500">
              wzy archive of photographs and quiet notes
            </p>
            <h1 className="mx-auto max-w-5xl text-center text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[7.25rem] lg:leading-[0.96]">
              向光而行
              <br />
              <span className="bg-gradient-to-b from-slate-950 via-slate-600 to-white bg-clip-text text-transparent">
                俯仰成迹
              </span>
            </h1>
            <p className="editorial-english mx-auto mt-10 max-w-4xl text-center text-xl leading-9 text-slate-600 sm:text-2xl">
              “The happiness of the past, in the blink of an eye, will have already become a distant memory.”
            </p>
            <p className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-white/70 bg-white/60 px-6 py-5 text-base leading-8 text-slate-600 shadow-[0_12px_34px_rgba(148,163,184,0.16)] backdrop-blur-xl sm:text-lg">
              镜头记住光的方向，文字收拢时间退去之后仍旧停留的余意。
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={featuredHref}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                进入最近内容
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#notes"
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-6 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:text-slate-950"
              >
                向下探索
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
                照片 {publishedPhotos.length}
              </span>
              <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
                照片手记 {publishedPhotoNotes.length}
              </span>
              <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
                随笔 {publishedJournals.length}
              </span>
              <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
                全部内容 {publishedNotes.length}
              </span>
            </div>
          </div>
        </section>

        <section id="notes" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Selected Frames
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              最近拍下的光线，先于解释抵达
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              让照片先完整出现，信息在你靠近时再轻一点地浮出来。
            </p>
          </div>

          <NoteMasonry notes={publishedPhotos} />
        </section>

        <div className="mt-10">
          <EditorialNotes notes={publishedPhotoNotes} />
        </div>
      </main>
    </div>
  );
}
