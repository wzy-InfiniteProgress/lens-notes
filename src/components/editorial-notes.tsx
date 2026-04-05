import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Note } from "@/content/site";

type EditorialNotesProps = {
  notes: Note[];
};

export function EditorialNotes({ notes }: EditorialNotesProps) {
  if (notes.length === 0) {
    return null;
  }

  const [featured, ...rest] = notes;

  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Photo Notes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            留给照片旁边的那些慢一点的句子
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            这一块只收纳与照片现场有关的手记，不会和随笔页混在一起。
          </p>
        </div>
        <Link
          href={`/notes/${featured.slug}`}
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:border-slate-900 hover:text-slate-950"
        >
          阅读最新手记
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Link
          href={`/notes/${featured.slug}`}
          className="group relative overflow-hidden rounded-[2.4rem] border border-white/50 shadow-[0_18px_56px_rgba(15,23,42,0.12)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.coverImage}
            alt={featured.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.42)_40%,rgba(15,23,42,0.82))]" />
          <div className="relative flex min-h-[31rem] flex-col justify-end p-7 text-white sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/68">
              Featured Photo Note
            </p>
            <h3 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              {featured.title}
            </h3>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 sm:text-base">
              {featured.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/72">
              <span>{new Date(featured.date).toLocaleDateString("zh-CN")}</span>
              <span className="h-1 w-1 rounded-full bg-white/55" />
              <span>{featured.location}</span>
              <span className="h-1 w-1 rounded-full bg-white/55" />
              <span>{featured.readTime}</span>
            </div>
          </div>
        </Link>

        <div className="grid gap-6">
          {rest.slice(0, 2).map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="group relative overflow-hidden rounded-[2rem] border border-white/45 shadow-[0_16px_48px_rgba(15,23,42,0.10)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={note.coverImage}
                alt={note.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.48)_44%,rgba(15,23,42,0.82))]" />
              <div className="relative flex min-h-[15rem] flex-col justify-end p-6 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-white/64">
                  {new Date(note.date).toLocaleDateString("zh-CN")}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{note.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/76">{note.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/86">
                  进入阅读
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
