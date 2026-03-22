type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm backdrop-blur-md">
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}
