"use client";

import { useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";

type BlockNoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeInitialHtml(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "<p></p>";
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

export function BlockNoteEditor({ value, onChange }: BlockNoteEditorProps) {
  const editor = useCreateBlockNote();
  const lastExternalValue = useRef("");

  useEffect(() => {
    const normalized = normalizeInitialHtml(value);
    if (normalized === lastExternalValue.current) {
      return;
    }

    const blocks = editor.tryParseHTMLToBlocks(normalized);
    editor.replaceBlocks(editor.document, blocks.length ? blocks : [{ type: "paragraph" }]);
    lastExternalValue.current = normalized;
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-xs leading-6 text-slate-500">
        这是 BlockNote 对比版，偏块编辑体验，更适合长篇随笔和笔记整理。
      </div>
      <div className="blocknote-shell px-3 py-3">
        <BlockNoteView
          editor={editor}
          theme="light"
          onChange={() => {
            const html = editor.blocksToHTMLLossy(editor.document);
            lastExternalValue.current = html;
            onChange(html);
          }}
        />
      </div>
    </div>
  );
}
