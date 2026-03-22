import Link from "next/link";
import { deleteSelectedNotesAction } from "@/app/admin/actions/note-actions";
import { signOutAction } from "@/app/auth/sign-in/actions";
import { Header } from "@/components/header";
import { EmptyState } from "@/components/empty-state";
import { StatusBanner } from "@/components/status-banner";
import { requireAdminUser } from "@/lib/auth/session";
import { getAdminNotes } from "@/lib/notes/data";

type AdminPageProps = {
  searchParams: Promise<{ preview?: string; deleted?: string; saved?: string; created?: string; error?: string; deletedCount?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [{ previewMode }, notes, params] = await Promise.all([
    requireAdminUser("/admin"),
    getAdminNotes(),
    searchParams,
  ]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              管理你的照片笔记
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              这里会展示当前账号下的全部笔记。Supabase 配置完成后，会自动切到真实鉴权与数据库数据。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!previewMode ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  退出登录
                </button>
              </form>
            ) : null}
            <Link
              href="/admin/new"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              新建内容
            </Link>
          </div>
        </div>

        {previewMode || params.preview ? (
          <StatusBanner tone="warning">
            当前处于预览模式，还没有连接 Supabase。填好 `.env.local` 后，后台会自动切换到真实登录和数据库读写。
          </StatusBanner>
        ) : null}

        {params.deleted ? (
          <StatusBanner tone="success">
            已删除 {params.deletedCount ?? "1"} 条内容。
          </StatusBanner>
        ) : null}

        {params.created ? (
          <StatusBanner tone="success">
            内容已创建完成，当前列表会直接显示最新状态。
          </StatusBanner>
        ) : null}

        {params.saved ? (
          <StatusBanner tone="success">
            修改已保存。
          </StatusBanner>
        ) : null}

        {params.error ? <StatusBanner tone="error">{params.error}</StatusBanner> : null}

        <form
          action={deleteSelectedNotesAction}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-500">已收录 {notes.length} 条内容</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                勾选后可批量删除照片或手记
              </p>
            </div>
            <button
              type="submit"
              className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-500 hover:text-rose-700"
            >
              删除选中
            </button>
          </div>

          <div className="hidden grid-cols-[0.5fr_1.2fr_0.8fr_0.7fr_0.8fr_0.6fr] gap-4 border-b border-slate-200 px-6 py-4 text-sm font-medium text-slate-500 md:grid">
            <span>选择</span>
            <span>标题</span>
            <span>类型</span>
            <span>状态</span>
            <span>日期</span>
            <span>操作</span>
          </div>

          <div className="md:hidden">
            {notes.map((note) => (
              <label key={note.id} className="block border-b border-slate-100 px-5 py-5 last:border-b-0">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    name="selectedIds"
                    value={note.id}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold tracking-tight text-slate-900">{note.title}</p>
                        <p className="mt-2 text-sm text-slate-500">
                          {note.entryType === "photo" ? "照片" : "手记"} · {new Date(note.date).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {note.status === "draft" ? "草稿" : "已发布"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                        {note.entryType === "photo" ? "照片内容" : "手记内容"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/admin/edit/${note.id}`}
                        className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                      >
                        编辑
                      </Link>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="hidden md:block">
            {notes.map((note) => (
              <label
                key={note.id}
                className="grid cursor-pointer grid-cols-[0.5fr_1.2fr_0.8fr_0.7fr_0.8fr_0.6fr] gap-4 border-b border-slate-100 px-6 py-5 text-sm text-slate-700 last:border-b-0"
              >
                <span>
                  <input
                    type="checkbox"
                    name="selectedIds"
                    value={note.id}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </span>
                <span className="font-medium text-slate-900">{note.title}</span>
                <span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {note.entryType === "photo" ? "照片" : "手记"}
                  </span>
                </span>
                <span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {note.status === "draft" ? "草稿" : "已发布"}
                  </span>
                </span>
                <span>{new Date(note.date).toLocaleDateString("zh-CN")}</span>
                <Link href={`/admin/edit/${note.id}`} className="font-medium text-slate-900 hover:text-slate-600">
                  编辑
                </Link>
              </label>
            ))}
          </div>
        </form>

        {notes.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="还没有内容"
              description="第一篇笔记建好以后，这里会显示你的标题、状态和编辑入口。"
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
