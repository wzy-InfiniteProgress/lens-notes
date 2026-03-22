import type { Note } from "@/content/site";
import { NoteCard } from "@/components/note-card";

type NoteMasonryProps = {
  notes: Note[];
};

function splitIntoColumns(notes: Note[], count: number) {
  const columns = Array.from({ length: count }, () => [] as Note[]);
  notes.forEach((note, index) => {
    columns[index % count].push(note);
  });
  return columns;
}

export function NoteMasonry({ notes }: NoteMasonryProps) {
  const twoColumns = splitIntoColumns(notes, 2);
  const threeColumns = splitIntoColumns(notes, 3);

  return (
    <>
      <div className="grid gap-6 md:hidden">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>

      <div className="hidden grid-cols-2 gap-6 md:grid xl:hidden">
        {twoColumns.map((column, index) => (
          <div key={`two-col-${index}`} className="space-y-6">
            {column.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ))}
      </div>

      <div className="hidden grid-cols-3 gap-6 xl:grid">
        {threeColumns.map((column, index) => (
          <div key={`three-col-${index}`} className="space-y-6">
            {column.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
