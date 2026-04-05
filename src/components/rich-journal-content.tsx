"use client";

import { useEffect, useMemo, useRef } from "react";
import { ensureMermaid } from "@/lib/mermaid";

type RichJournalContentProps = {
  content: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeRichHtml(value: string) {
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

export function RichJournalContent({ content }: RichJournalContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => normalizeRichHtml(content), [content]);

  useEffect(() => {
    const rootNode = ref.current;
    if (!rootNode) {
      return;
    }

    let cancelled = false;

    async function enhanceMindmaps() {
      const codeBlocks = Array.from(rootNode!.querySelectorAll("pre code")).filter((node) =>
        node.textContent?.trim().startsWith("mindmap"),
      );

      if (!codeBlocks.length) {
        return;
      }

      const mermaid = await ensureMermaid();
      if (cancelled) {
        return;
      }

      const nodes: HTMLElement[] = [];

      codeBlocks.forEach((codeNode) => {
        const pre = codeNode.closest("pre");
        if (!pre) {
          return;
        }

        const container = document.createElement("div");
        container.className = "journal-mindmap mermaid";
        container.textContent = codeNode.textContent ?? "";
        pre.replaceWith(container);
        nodes.push(container);
      });

      if (!nodes.length) {
        return;
      }

      await mermaid.run({
        nodes,
        suppressErrors: true,
      });
    }

    enhanceMindmaps().catch(() => {
      // Leave the authored HTML in place if Mermaid enhancement fails.
    });

    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="journal-rich article-prose article-prose-journal prose prose-slate max-w-none prose-xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
