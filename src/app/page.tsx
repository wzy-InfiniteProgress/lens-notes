import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { EditorialNotes } from "@/components/editorial-notes";
import { Header } from "@/components/header";
import { NoteMasonry } from "@/components/note-masonry";
import { siteConfig } from "@/content/site";
import { getPublishedJournals, getPublishedNotes, getPublishedPhotos } from "@/lib/notes/data";

export default async function HomePage() {
  const [publishedNotes, publishedPhotos, publishedJournals] = await Promise.all([
    getPublishedNotes(),
    getPublishedPhotos(),
    getPublishedJournals(),
  ]);
  const featured = publishedNotes[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_32%),radial-gradient(circle_at_85%_12%,_rgba(226,232,240,0.75),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#f4f4f5_48%,_#ffffff_100%)]">
      <Header />
      <main className="pb-20">
        <section className="relative mx-auto flex min-h-[84vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.38em] text-slate-500">
              Photo Notes Blog
            </p>
            <h1 className="mx-auto max-w-5xl text-center text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[7.25rem] lg:leading-[0.96]">
              透过镜头
              <br />
              <span className="bg-gradient-to-b from-slate-950 via-slate-600 to-white bg-clip-text text-transparent">
                记录世界的静默层次
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-white/70 bg-white/60 px-6 py-5 text-base leading-8 text-slate-600 shadow-[0_12px_34px_rgba(148,163,184,0.16)] backdrop-blur-xl sm:text-lg">
              {siteConfig.tagline} 这里把摄影作品与文字手记拆成两个独立模块，让画面和叙述都能保持自己的呼吸感。
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={featured ? `/notes/${featured.slug}` : "#notes"}
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
                手记 {publishedJournals.length}
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
              无序陈列最近的图像与片段
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              默认让画面本身完整呈现，信息在悬停时轻盈浮出。
            </p>
          </div>

          <NoteMasonry notes={publishedPhotos} />
        </section>

        <div className="mt-10">
          <EditorialNotes notes={publishedJournals} />
        </div>

        <section id="about" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                About This Space
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                一个把照片和手记分开书写的个人空间
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                这里不是社交动态，也不是模板化博客。照片负责留住现场的气息，手记负责把那些不适合放进标题里的片段慢慢写出来。
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-sm leading-7 text-slate-200">
              <p>当前节奏</p>
              <ul className="mt-3 space-y-2 text-slate-300">
                <li>瀑布流只展示照片，让画面保持优先级</li>
                <li>手记以独立阅读区存在，不抢占照片节奏</li>
                <li>后台按内容类型发布，管理更清晰</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
