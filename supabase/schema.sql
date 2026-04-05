create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null default 'journal' check (entry_type in ('photo', 'journal')),
  journal_space text default 'photo_notes' check (journal_space in ('photo_notes', 'journals')),
  journal_category text check (journal_category in ('life', 'study', 'fragment')),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_photo_url text,
  location text,
  shot_at timestamptz,
  camera text,
  aperture text,
  shutter_speed text,
  iso text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row
execute function public.set_updated_at();

alter table public.notes enable row level security;
alter table public.photos enable row level security;

drop policy if exists "Published notes are readable by everyone" on public.notes;
create policy "Published notes are readable by everyone"
on public.notes
for select
using (status = 'published');

drop policy if exists "Users can view their own notes" on public.notes;
create policy "Users can view their own notes"
on public.notes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own notes" on public.notes;
create policy "Users can insert their own notes"
on public.notes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
on public.notes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
on public.notes
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Published note photos are readable by everyone" on public.photos;
create policy "Published note photos are readable by everyone"
on public.photos
for select
using (
  exists (
    select 1
    from public.notes
    where notes.id = photos.note_id
      and notes.status = 'published'
  )
);

drop policy if exists "Users can view their own photos" on public.photos;
create policy "Users can view their own photos"
on public.photos
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own photos" on public.photos;
create policy "Users can insert their own photos"
on public.photos
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own photos" on public.photos;
create policy "Users can update their own photos"
on public.photos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own photos" on public.photos;
create policy "Users can delete their own photos"
on public.photos
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "Public can read uploaded assets" on storage.objects;
create policy "Public can read uploaded assets"
on storage.objects
for select
using (bucket_id = 'uploads');

drop policy if exists "Authenticated users can upload assets" on storage.objects;
create policy "Authenticated users can upload assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their own assets" on storage.objects;
create policy "Users can update their own assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete their own assets" on storage.objects;
create policy "Users can delete their own assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);
