import { notFound } from "next/navigation";
import { deleteNoteAction } from "@/app/admin/actions/note-actions";
import { AdminNoteForm } from "@/components/admin-note-form";
import { Header } from "@/components/header";
import { StatusBanner } from "@/components/status-banner";
import { requireAdminUser } from "@/lib/auth/session";
import { getAdminNoteById } from "@/lib/notes/data";

type EditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; created?: string }>;
};

export default async function EditNotePage({ params, searchParams }: EditPageProps) {
  const [{ previewMode }, { id }, query] = await Promise.all([
    requireAdminUser("/admin"),
    params,
    searchParams,
  ]);
  const note = await getAdminNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Admin / Edit
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-600">
              {note.entryType === "photo" ? "Photo Entry" : "Journal Entry"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-600">
              {note.status === "draft" ? "Draft" : "Published"}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            编辑：{note.title}
          </h1>
        </div>
        {previewMode ? (
          <StatusBanner tone="warning">
            当前仍是预览模式。真正接入 Supabase 后，这个页面会直接编辑线上数据。
          </StatusBanner>
        ) : null}
        {query.saved || query.created ? (
          <StatusBanner tone="success">
            内容已保存。
          </StatusBanner>
        ) : null}
        {query.error ? (
          <StatusBanner tone="error">{query.error}</StatusBanner>
        ) : null}
        <AdminNoteForm note={note} />
        <form action={deleteNoteAction} className="mt-5">
          <input type="hidden" name="id" value={note.id} />
          <button
            type="submit"
            className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-600 transition hover:border-rose-500 hover:text-rose-700"
          >
            删除这条内容
          </button>
        </form>
      </main>
    </div>
  );
}
