"use client";

import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

type RichTextEditorProps = {
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

type ToolbarButton = {
  label: string;
  icon: typeof Bold;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
  onPress: () => void;
  keepNeutral?: boolean;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const initialContent = useMemo(() => normalizeInitialHtml(value), [value]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "输入这一段的小标题";
          }

          return "在这里开始写作。支持标题、列表、引用、链接和代码块。";
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-surface min-h-[22rem] px-5 py-5 text-[15px] leading-8 text-slate-800 focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = normalizeInitialHtml(value);
    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-sm text-slate-500">
        正在加载编辑器...
      </div>
    );
  }

  const buttons: ToolbarButton[] = [
    {
      label: "段落",
      icon: Pilcrow,
      keepNeutral: true,
      onPress: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "标题 2",
      icon: Heading2,
      isActive: () => editor.isActive("heading", { level: 2 }),
      onPress: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "标题 3",
      icon: Heading3,
      isActive: () => editor.isActive("heading", { level: 3 }),
      onPress: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "加粗",
      icon: Bold,
      isActive: () => editor.isActive("bold"),
      onPress: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "斜体",
      icon: Italic,
      isActive: () => editor.isActive("italic"),
      onPress: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "链接",
      icon: Link2,
      isActive: () => editor.isActive("link"),
      onPress: () => {
        const previousUrl = editor.getAttributes("link").href as string | undefined;
        const nextUrl = window.prompt("输入链接地址", previousUrl ?? "https://");

        if (nextUrl === null) {
          return;
        }

        const trimmed = nextUrl.trim();

        if (!trimmed) {
          editor.chain().focus().unsetLink().run();
          return;
        }

        const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

        if (editor.state.selection.empty) {
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${escapeHtml(href)}">${escapeHtml(trimmed)}</a>`)
            .run();
          return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      },
    },
    {
      label: "引用",
      icon: Quote,
      isActive: () => editor.isActive("blockquote"),
      onPress: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "项目列表",
      icon: List,
      isActive: () => editor.isActive("bulletList"),
      onPress: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "编号列表",
      icon: ListOrdered,
      isActive: () => editor.isActive("orderedList"),
      onPress: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "代码块",
      icon: Code2,
      isActive: () => editor.isActive("codeBlock"),
      onPress: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "撤销",
      icon: Undo2,
      isDisabled: () => !editor.can().chain().focus().undo().run(),
      onPress: () => editor.chain().focus().undo().run(),
    },
    {
      label: "重做",
      icon: Redo2,
      isDisabled: () => !editor.can().chain().focus().redo().run(),
      onPress: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        {buttons.map((button) => {
          const Icon = button.icon;
          const active = button.keepNeutral ? false : button.isActive?.() ?? false;
          const disabled = button.isDisabled?.() ?? false;

          return (
            <button
              key={button.label}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                if (!disabled) {
                  button.onPress();
                }
              }}
              disabled={disabled}
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              className="tiptap-toolbar-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition"
            >
              <Icon className="h-4 w-4" />
              <span>{button.label}</span>
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} />
      <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-xs leading-6 text-slate-500">
        当前采用官方 Tiptap `StarterKit + Placeholder` 方案，先把正文编辑、链接、列表和标题体验收稳。
      </div>
    </div>
  );
}
