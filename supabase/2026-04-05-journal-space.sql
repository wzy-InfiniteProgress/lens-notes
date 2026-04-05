alter table public.notes
  add column if not exists journal_space text default 'photo_notes';

alter table public.notes
  drop constraint if exists notes_journal_space_check;

alter table public.notes
  add constraint notes_journal_space_check
  check (journal_space in ('photo_notes', 'journals'));

update public.notes
set journal_space = 'photo_notes'
where entry_type = 'journal'
  and journal_space is null;
