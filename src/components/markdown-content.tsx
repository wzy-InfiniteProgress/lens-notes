import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
  variant?: "photo" | "journal";
};

export function MarkdownContent({ content, variant = "journal" }: MarkdownContentProps) {
  const proseClassName =
    variant === "photo"
      ? "prose prose-slate max-w-none prose-headings:tracking-tight prose-headings:text-slate-950 prose-p:leading-8 prose-p:text-slate-650 prose-li:leading-8 prose-li:text-slate-650 prose-strong:text-slate-950 prose-blockquote:rounded-r-2xl prose-blockquote:border-slate-300 prose-blockquote:bg-slate-50 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:text-slate-600"
      : "prose prose-slate max-w-none prose-xl prose-headings:tracking-tight prose-headings:text-slate-950 prose-p:leading-10 prose-p:text-slate-700 prose-li:leading-8 prose-li:text-slate-700 prose-strong:text-slate-950 prose-blockquote:rounded-[1.5rem] prose-blockquote:border-slate-200 prose-blockquote:bg-slate-50/90 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-slate-600";

  return (
    <div className={proseClassName}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
