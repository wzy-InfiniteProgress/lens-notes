import Image from "next/image";
import Link from "next/link";
import { Aperture, ArrowUpRight, MapPin, Sun, Timer } from "lucide-react";
import type { Note } from "@/content/site";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="group relative w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-[box-shadow] duration-500 hover:shadow-[0_18px_55px_rgba(15,23,42,0.14)]">
      <Link href={`/notes/${note.slug}`} className="block">
        <div
          className="relative overflow-hidden rounded-[2rem]"
          style={{ aspectRatio: note.imageAspect }}
        >
          <Image
            src={note.coverImage}
            alt={note.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={Boolean(note.featured)}
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent transition duration-500 group-hover:from-slate-950/50" />

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="pointer-events-none translate-y-7 rounded-[1.25rem] border border-white/20 bg-slate-950/42 p-3.5 opacity-0 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/14 px-2.5 py-1 text-[10px] font-medium text-white/78">
                    <MapPin className="h-3 w-3" />
                    {note.location}
                  </div>
                  <h2 className="max-w-[15ch] text-lg font-semibold leading-tight tracking-tight text-white">
                    {note.title}
                  </h2>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 p-2 text-white/90">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-medium text-white/78">
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/10 px-2 py-1">
                  {new Date(note.date).toLocaleDateString("zh-CN")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/10 px-2 py-1">
                  <Aperture className="h-3 w-3 text-white/55" />
                  {note.aperture}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/10 px-2 py-1">
                  <Timer className="h-3 w-3 text-white/55" />
                  {note.shutterSpeed}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/10 px-2 py-1">
                  <Sun className="h-3 w-3 text-white/55" />
                  ISO {note.iso}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
