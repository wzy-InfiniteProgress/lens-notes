"use client";

import { useFormStatus } from "react-dom";

function SubmitButton({
  label,
  pendingLabel,
  variant,
  onClick,
}: {
  label: string;
  pendingLabel: string;
  variant: "primary" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();

  const className =
    variant === "primary"
      ? "rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      : "rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400";

  return (
    <button type="submit" onClick={onClick} disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function FormSubmitButtons({
  entryType,
  onStatusChange,
}: {
  entryType?: "photo" | "journal";
  onStatusChange?: (value: "draft" | "published") => void;
}) {
  const publishLabel = entryType === "photo" ? "发布照片" : "发布手记";

  return (
    <div className="flex flex-wrap gap-3">
      <SubmitButton
        label="保存草稿"
        pendingLabel="保存中..."
        variant="secondary"
        onClick={(event) => {
          const form = event.currentTarget.form;
          const status = form?.elements.namedItem("status");
          if (status instanceof HTMLSelectElement || status instanceof HTMLInputElement) {
            status.value = "draft";
          }
          onStatusChange?.("draft");
        }}
      />
      <SubmitButton
        label={publishLabel}
        pendingLabel="发布中..."
        variant="primary"
        onClick={(event) => {
          const form = event.currentTarget.form;
          const status = form?.elements.namedItem("status");
          if (status instanceof HTMLSelectElement || status instanceof HTMLInputElement) {
            status.value = "published";
          }
          onStatusChange?.("published");
        }}
      />
    </div>
  );
}
