import { Header } from "@/components/header";
import { AdminNoteForm } from "@/components/admin-note-form";
import { StatusBanner } from "@/components/status-banner";
import { requireAdminUser } from "@/lib/auth/session";

type NewNotePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewNotePage({ searchParams }: NewNotePageProps) {
  const { previewMode } = await requireAdminUser("/admin/new");
  const params = await searchParams;

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
            这里可以选择发布照片或发布手记。两种内容会在首页以不同模块展示。
          </p>
        </div>
        {previewMode ? (
          <StatusBanner tone="warning">
            当前为预览模式。你可以先看表单结构，接入 Supabase 后这里会直接保存到数据库。
          </StatusBanner>
        ) : null}
        {params.error ? <StatusBanner tone="error">{params.error}</StatusBanner> : null}
        <AdminNoteForm />
      </main>
    </div>
  );
}
