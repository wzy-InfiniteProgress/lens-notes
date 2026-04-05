import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
  variant?: "photo" | "journal";
};

export function MarkdownContent({ content, variant = "journal" }: MarkdownContentProps) {
  const proseClassName =
    variant === "photo"
      ? "article-prose article-prose-photo prose prose-slate max-w-none"
      : "article-prose article-prose-journal prose prose-slate max-w-none prose-xl";

  return (
    <div className={proseClassName}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
