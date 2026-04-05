import { Header } from "@/components/header";
import { AdminNoteForm } from "@/components/admin-note-form";
import { StatusBanner } from "@/components/status-banner";
import { requireAdminUser } from "@/lib/auth/session";

type NewNotePageProps = {
  searchParams: Promise<{ error?: string; type?: string }>;
};

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  const { previewMode } = await requireAdminUser("/admin/new");
  const params = await searchParams;
  const initialPublishMode =
    params.type === "photo"
      ? "photo"
      : params.type === "photo_note"
        ? "photo_note"
        : "essay";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Admin / New
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            新建内容
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            这里可以分别创建照片、照片手记和随笔。它们会进入各自的展示区域，不再混在一起。
          </p>
        </div>
        {previewMode ? (
          <StatusBanner tone="warning">
            当前为预览模式。你可以先看表单结构，接入 Supabase 后这里会直接保存到数据库。
          </StatusBanner>
        ) : null}
        {params.error ? <StatusBanner tone="error">{params.error}</StatusBanner> : null}
        <AdminNoteForm initialPublishMode={initialPublishMode} />
      </main>
    </div>
  );
}
