alter table public.notes
  add column if not exists entry_type text not null default 'journal',
  add column if not exists location text,
  add column if not exists shot_at timestamptz,
  add column if not exists camera text,
  add column if not exists aperture text,
  add column if not exists shutter_speed text,
  add column if not exists iso text;

alter table public.notes
  drop constraint if exists notes_entry_type_check;

alter table public.notes
  add constraint notes_entry_type_check
  check (entry_type in ('photo', 'journal'));

update public.notes
set entry_type = 'journal'
where entry_type is null;
