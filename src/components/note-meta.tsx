import { CalendarDays, MapPin, Timer } from "lucide-react";

type NoteMetaProps = {
  date: string;
  location: string;
  readTime: string;
};

export function NoteMeta({ date, location, readTime }: NoteMetaProps) {
  const items = [
    { icon: CalendarDays, label: new Date(date).toLocaleDateString("zh-CN") },
    { icon: MapPin, label: location },
    { icon: Timer, label: readTime },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur-md"
        >
          <Icon className="h-4 w-4" />
          {label}
        </span>
      ))}
    </div>
  );
}
