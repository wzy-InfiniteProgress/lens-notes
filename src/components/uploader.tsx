"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Star, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/env";
import { extractPhotoMetadata, type ExtractedPhotoMetadata } from "@/lib/photo-metadata";

export type ManagedPhoto = {
  id: string;
  src: string;
  storagePath: string;
  caption?: string;
  isCover?: boolean;
};

type UploaderProps = {
  initialPhotos?: ManagedPhoto[];
  coverPhotoUrl?: string;
  onCoverChange: (value: string) => void;
  onPhotosChange: (photos: ManagedPhoto[]) => void;
  onLeadPhotoMetadata?: (metadata: ExtractedPhotoMetadata) => void;
  mode?: "photo" | "journal";
};

function createLocalPhoto(file: File): ManagedPhoto {
  const objectUrl = URL.createObjectURL(file);

  return {
    id: crypto.randomUUID(),
    src: objectUrl,
    storagePath: objectUrl,
  };
}

export function Uploader({
  initialPhotos = [],
  coverPhotoUrl = "",
  onCoverChange,
  onPhotosChange,
  onLeadPhotoMetadata,
  mode = "journal",
}: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<ManagedPhoto[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewPhotos = useMemo(
    () =>
      photos.map((photo) => ({
        ...photo,
        isCover: coverPhotoUrl ? photo.src === coverPhotoUrl || photo.storagePath === coverPhotoUrl : false,
      })),
    [coverPhotoUrl, photos],
  );

  function updatePhotos(nextPhotos: ManagedPhoto[]) {
    setPhotos(nextPhotos);
    onPhotosChange(nextPhotos);
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setMessage(null);
    setIsUploading(true);

    const fileList = Array.from(files);
    const leadFile = fileList[0];

    if (!hasSupabaseEnv()) {
      const localPhotos = fileList.map(createLocalPhoto);
      const nextPhotos = [...photos, ...localPhotos];
      updatePhotos(nextPhotos);
      if (!coverPhotoUrl && localPhotos[0]) {
        onCoverChange(localPhotos[0].storagePath);
      }
      if (mode === "photo" && leadFile && onLeadPhotoMetadata) {
        onLeadPhotoMetadata(await extractPhotoMetadata(leadFile));
      }
      setMessage("当前是预览模式，图片只会在本地临时预览，不会真正上传。");
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("请先登录后台，再上传图片。");
        setIsUploading(false);
        return;
      }

      const uploadedPhotos = await Promise.all(
        fileList.map(async (file) => {
          const ext = file.name.split(".").pop() ?? "jpg";
          const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("uploads").upload(path, file, {
            upsert: false,
            cacheControl: "3600",
          });

          if (error) {
            throw error;
          }

          const { data } = supabase.storage.from("uploads").getPublicUrl(path);

          return {
            id: crypto.randomUUID(),
            src: data.publicUrl,
            storagePath: path,
          };
        }),
      );

      const nextPhotos = [...photos, ...uploadedPhotos];
      updatePhotos(nextPhotos);
      if (!coverPhotoUrl && uploadedPhotos[0]) {
        onCoverChange(uploadedPhotos[0].storagePath);
      }
      if (mode === "photo" && leadFile && onLeadPhotoMetadata) {
        onLeadPhotoMetadata(await extractPhotoMetadata(leadFile));
      }
      setMessage("图片已上传，可以直接设为封面并随笔记一起保存。");
    } catch (error) {
      const text = error instanceof Error ? error.message : "上传失败";
      setMessage(text);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removePhoto(id: string) {
    const target = photos.find((photo) => photo.id === id);
    const nextPhotos = photos.filter((photo) => photo.id !== id);
    updatePhotos(nextPhotos);
    setMessage("图片已从当前内容中移除。");

    if (target && (coverPhotoUrl === target.src || coverPhotoUrl === target.storagePath)) {
      onCoverChange(nextPhotos[0]?.storagePath ?? "");
    }
  }

  function updateCaption(id: string, caption: string) {
    updatePhotos(
      photos.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              caption,
            }
          : photo,
      ),
    );
  }

  function movePhoto(id: string, direction: "up" | "down") {
    const index = photos.findIndex((photo) => photo.id === id);
    if (index === -1) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) {
      return;
    }

    const nextPhotos = [...photos];
    const [item] = nextPhotos.splice(index, 1);
    nextPhotos.splice(targetIndex, 0, item);
    updatePhotos(nextPhotos);
    setMessage(direction === "up" ? "图片顺序已上移。" : "图片顺序已下移。");
  }

  return (
    <div className="space-y-5">
      <div
        className={`rounded-[2rem] border border-dashed p-8 text-center transition ${
          isDragging
            ? "border-slate-900 bg-slate-100/95 shadow-[0_12px_34px_rgba(15,23,42,0.10)]"
            : "border-slate-300 bg-slate-50/80"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void uploadFiles(event.dataTransfer.files);
        }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          {isDragging ? "松开以上传图片" : mode === "photo" ? "拖拽摄影作品到这里" : "拖拽配图到这里"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === "photo"
            ? "上传后会自动加入照片列表，并尝试读取首张照片的拍摄参数。"
            : "上传后会自动加入图片列表。你可以把其中任意一张设成封面。"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void uploadFiles(event.target.files)}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {isUploading ? "上传中..." : "选择图片"}
        </button>
        {message ? <p className="mt-4 text-sm leading-6 text-slate-500">{message}</p> : null}
        {previewPhotos.length > 0 ? (
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
            当前已添加 {previewPhotos.length} 张图片
          </p>
        ) : null}
      </div>

      {previewPhotos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {previewPhotos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={photo.src} alt="Uploaded preview" fill className="object-cover" unoptimized />
                {photo.isCover ? (
                  <div className="absolute inset-0 ring-4 ring-inset ring-white/80" />
                ) : null}
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                      photo.isCover
                        ? "bg-slate-900 text-white"
                        : "bg-white/88 text-slate-700 backdrop-blur-md"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {photo.isCover ? "封面已选中" : "图片预览"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onCoverChange(photo.storagePath)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      photo.isCover
                        ? "bg-slate-900 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:border-slate-900"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {photo.isCover ? "当前封面" : "设为封面"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:border-rose-500"
                  >
                    删除
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(photo.id, "up")}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-900"
                  >
                    <span className="inline-flex items-center gap-1">
                      <ArrowUp className="h-3.5 w-3.5" />
                      上移
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(photo.id, "down")}
                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-900"
                  >
                    <span className="inline-flex items-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5" />
                      下移
                    </span>
                  </button>
                </div>
                <input
                  value={photo.caption ?? ""}
                  onChange={(event) => updateCaption(photo.id, event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="给这张图片写一句说明"
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
