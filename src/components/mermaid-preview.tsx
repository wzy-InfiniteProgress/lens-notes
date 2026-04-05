"use client";

import { useEffect, useId, useState } from "react";
import { ensureMermaid } from "@/lib/mermaid";

type MermaidPreviewProps = {
  code: string;
  className?: string;
};

export function MermaidPreview({ code, className }: MermaidPreviewProps) {
  const id = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderPreview() {
      try {
        const mermaid = await ensureMermaid();
        const { svg: renderedSvg } = await mermaid.render(`mindmap-${id}`, code);

        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setSvg("");
          setError("当前结构暂时无法生成思维导图，请检查层级缩进。");
        }
      }
    }

    renderPreview();

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className={className}>
        <div className="flex min-h-52 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm leading-7 text-slate-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="journal-mindmap"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
