import Link from "next/link";
import { signInAction } from "@/app/auth/sign-in/actions";
import { hasSupabaseEnv } from "@/lib/env";

type SignInPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next, error } = await searchParams;
  const previewMode = !hasSupabaseEnv();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(199,210,254,0.7),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Lens Notes
        </Link>
        <div className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Sign In</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">登录后台</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            填写你的 Supabase Auth 邮箱和密码即可进入后台管理。
          </p>

          {previewMode ? (
            <div className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              当前未配置 Supabase 环境变量，所以这里处于预览模式。填好 `.env.local` 后，这个登录页会自动切到真实鉴权。
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
              {error}
            </div>
          ) : null}

          <form action={signInAction} className="mt-6 space-y-5">
            <input type="hidden" name="next" value={next ?? "/admin"} />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">邮箱</span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="you@example.com"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">密码</span>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
