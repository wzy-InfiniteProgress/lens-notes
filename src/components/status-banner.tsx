type StatusBannerProps = {
  tone: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
};

const toneClasses: Record<StatusBannerProps["tone"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function StatusBanner({ tone, children }: StatusBannerProps) {
  return (
    <div className={`rounded-[1.5rem] border px-5 py-4 text-sm leading-7 ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
