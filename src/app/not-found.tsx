import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2.5rem] border border-white/70 bg-white/85 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          404
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            这页内容暂时没有被找到
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-slate-600 sm:text-base">
            可能是链接有误，也可能是这篇内容仍处于草稿状态。你可以回到首页继续浏览最近的照片和手记。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              回到首页
            </Link>
            <Link
              href="/admin"
              className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              进入后台
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
