"use client";

import { useMemo, useState } from "react";
import { upsertNoteAction } from "@/app/admin/actions/note-actions";
import { FormSubmitButtons } from "@/components/form-submit-buttons";
import type { Note } from "@/content/site";
import { Uploader, type ManagedPhoto } from "@/components/uploader";
import type { ExtractedPhotoMetadata } from "@/lib/photo-metadata";

type AdminNoteFormProps = {
  note?: Note;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminNoteForm({ note }: AdminNoteFormProps) {
  const initialPhotos = useMemo<ManagedPhoto[]>(
    () =>
      (note?.photos ?? []).map((photo) => ({
        id: photo.id,
        src: photo.src,
        storagePath: photo.storagePath ?? photo.src,
        caption: photo.caption,
      })),
    [note],
  );

  const [entryType, setEntryType] = useState<"photo" | "journal">(note?.entryType ?? "photo");
  const [status, setStatus] = useState<"draft" | "published">(note?.status ?? "draft");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    note?.photos.find((photo) => photo.src === note.coverImage)?.storagePath ??
      note?.photos[0]?.storagePath ??
      note?.coverImage ??
      "",
  );
  const [photos, setPhotos] = useState<ManagedPhoto[]>(initialPhotos);
  const [title, setTitle] = useState(note?.title ?? "");
  const [slug, setSlug] = useState(note?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(note?.slug));
  const [excerpt, setExcerpt] = useState(note?.excerpt ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [location, setLocation] = useState(note?.location ?? "");
  const [shotAt, setShotAt] = useState(note?.shotAt?.slice(0, 16) ?? "");
  const [camera, setCamera] = useState(note?.camera ?? "");
  const [aperture, setAperture] = useState(note?.aperture ?? "");
  const [shutterSpeed, setShutterSpeed] = useState(note?.shutterSpeed ?? "");
  const [iso, setIso] = useState(note?.iso ?? "");

  const previewTitle = title || (entryType === "photo" ? "未命名照片" : "未命名手记");
  const previewExcerpt =
    excerpt ||
    (entryType === "photo"
      ? "这里会显示照片标题下方的简短说明。"
      : "这里会显示手记卡片里的摘要。建议写成一句有画面感的引子。");
  const previewCover =
    photos.find((photo) => photo.storagePath === coverPhotoUrl || photo.src === coverPhotoUrl)?.src ||
    coverPhotoUrl ||
    photos[0]?.src ||
    note?.coverImage ||
    "";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));

  function applyLeadPhotoMetadata(metadata: ExtractedPhotoMetadata) {
    if (!shotAt) {
      setShotAt(metadata.shotAt);
    }
    if (!camera || camera === "参数无") {
      setCamera(metadata.camera);
    }
    if (!aperture || aperture === "参数无") {
      setAperture(metadata.aperture);
    }
    if (!shutterSpeed || shutterSpeed === "参数无") {
      setShutterSpeed(metadata.shutterSpeed);
    }
    if (!iso || iso === "参数无") {
      setIso(metadata.iso);
    }
  }

  return (
    <form
      action={upsertNoteAction}
      className="space-y-6 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
    >
      <input type="hidden" name="id" value={note?.id ?? ""} />
      <input type="hidden" name="photosPayload" value={JSON.stringify(photos)} />
      <input type="hidden" name="entryType" value={entryType} />
      <input type="hidden" name="status" value={status} />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700">发布类型</span>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setEntryType("photo")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              entryType === "photo" ? "bg-slate-900 text-white" : "text-slate-600"
            }`}
          >
            发布照片
          </button>
          <button
            type="button"
            onClick={() => setEntryType("journal")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              entryType === "journal" ? "bg-slate-900 text-white" : "text-slate-600"
            }`}
          >
            发布手记
          </button>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          {status === "draft" ? "Draft" : "Published"}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">标题</span>
              <input
                name="title"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder={entryType === "photo" ? "输入照片标题" : "输入手记标题"}
                value={title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setTitle(nextTitle);
                  if (!slugTouched) {
                    setSlug(slugify(nextTitle));
                  }
                }}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Slug</span>
              <input
                name="slug"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="your-post-slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                required
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">摘要</span>
            <textarea
              name="excerpt"
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
              placeholder={entryType === "photo" ? "用一句话介绍这张照片" : "用于首页卡片展示的简短摘要"}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
            />
          </label>

          {entryType === "photo" ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">地名</span>
                  <input
                    name="location"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="例如：上海"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">拍摄时间</span>
                  <input
                    name="shotAt"
                    type="datetime-local"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    value={shotAt}
                    onChange={(event) => setShotAt(event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">相机</span>
                  <input
                    name="camera"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="自动读取或手动填写"
                    value={camera}
                    onChange={(event) => setCamera(event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">光圈</span>
                  <input
                    name="aperture"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="f/2.8 或 参数无"
                    value={aperture}
                    onChange={(event) => setAperture(event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">快门</span>
                  <input
                    name="shutterSpeed"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="1/250s 或 参数无"
                    value={shutterSpeed}
                    onChange={(event) => setShutterSpeed(event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">ISO</span>
                  <input
                    name="iso"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="200 或 参数无"
                    value={iso}
                    onChange={(event) => setIso(event.target.value)}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">照片说明</span>
                <textarea
                  name="content"
                  className="min-h-40 w-full rounded-[1.75rem] border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="写下这张照片的现场、光线或拍摄时的感受。"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">地名</span>
                <input
                  name="location"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="可选，用于记录写作地点"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">正文（Markdown）</span>
                <textarea
                  name="content"
                  className="min-h-72 w-full rounded-[1.75rem] border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="# 今天记录的，是一个更偏文字的片段..."
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                />
              </label>
            </>
          )}

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">封面图</span>
            <input
              name="coverPhotoUrl"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="会优先使用设为封面的那张图"
              value={coverPhotoUrl}
              onChange={(event) => setCoverPhotoUrl(event.target.value)}
            />
          </label>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[1.35rem] border border-white/70 bg-slate-950 text-white shadow-[0_10px_28px_rgba(15,23,42,0.12)]">
            <div className="relative aspect-[4/3.7] overflow-hidden bg-slate-900">
              {previewCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewCover}
                  alt={previewTitle}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/45">封面预览</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
                  {entryType === "photo" ? "Photo Preview" : "Journal Preview"}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-tight tracking-tight text-white">{previewTitle}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/72">{previewExcerpt}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Writing Snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">{entryType === "photo" ? "照片数" : "配图数"}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{photos.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">预计阅读</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{minutes} 分钟</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              <p>当前地址</p>
              <p className="mt-1 break-all font-medium text-slate-900">/notes/{slug || "your-slug"}</p>
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              <p>发布状态</p>
              <p className="mt-1 font-medium text-slate-900">{status === "draft" ? "草稿" : "已发布"}</p>
            </div>
          </div>
        </aside>
      </div>

      <Uploader
        initialPhotos={initialPhotos}
        coverPhotoUrl={coverPhotoUrl}
        onCoverChange={setCoverPhotoUrl}
        onPhotosChange={setPhotos}
        onLeadPhotoMetadata={applyLeadPhotoMetadata}
        mode={entryType}
      />

      <FormSubmitButtons
        entryType={entryType}
        onStatusChange={setStatus}
      />
    </form>
  );
}
