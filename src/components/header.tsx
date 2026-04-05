import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/75 px-5 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link href="/" className="flex items-center">
          <SiteLogo className="h-11 w-[164px]" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/#notes" className="transition hover:text-slate-950">
            Photos
          </Link>
          <Link href="/journals" className="transition hover:text-slate-950">
            随笔
          </Link>
          <Link href="/admin" className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
