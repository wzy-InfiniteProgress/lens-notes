alter table public.notes
  add column if not exists journal_space text default 'photo_notes',
  add column if not exists journal_category text;

alter table public.notes
  drop constraint if exists notes_journal_space_check;

alter table public.notes
  add constraint notes_journal_space_check
  check (journal_space in ('photo_notes', 'journals'));

alter table public.notes
  drop constraint if exists notes_journal_category_check;

alter table public.notes
  add constraint notes_journal_category_check
  check (journal_category in ('life', 'study', 'fragment'));

update public.notes
set journal_space = 'photo_notes'
where entry_type = 'journal'
  and journal_space is null;

update public.notes
set journal_category = 'life'
where entry_type = 'journal'
  and journal_space = 'journals'
  and journal_category is null;
