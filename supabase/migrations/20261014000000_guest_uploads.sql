-- Guest photo & video uploads from table QR codes.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement replaces what it creates.
--
-- Note: the admin screen talks to Supabase with the same public (anon) key as
-- guests, so reading and deleting uploads has to be allowed for that key too.
-- The bucket is private (no public file URLs), but anyone who has the anon key
-- could list or delete uploads through the API. Moving the admin to Supabase
-- Auth would let these policies be limited to signed-in admins.

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.upload_tables (
  id bigint generated always as identity primary key,
  label text not null check (char_length(label) between 1 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.guest_uploads (
  id bigint generated always as identity primary key,
  table_id bigint references public.upload_tables (id) on delete set null,
  table_label text not null,
  uploader_name text check (uploader_name is null or char_length(uploader_name) <= 80),
  file_path text not null unique,
  file_type text not null,
  file_size bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists guest_uploads_created_at_idx on public.guest_uploads (created_at desc);

alter table public.upload_tables enable row level security;
alter table public.guest_uploads enable row level security;

drop policy if exists "upload_tables select" on public.upload_tables;
drop policy if exists "upload_tables insert" on public.upload_tables;
drop policy if exists "upload_tables delete" on public.upload_tables;
create policy "upload_tables select" on public.upload_tables for select to anon, authenticated using (true);
create policy "upload_tables insert" on public.upload_tables for insert to anon, authenticated with check (true);
create policy "upload_tables delete" on public.upload_tables for delete to anon, authenticated using (true);

drop policy if exists "guest_uploads select" on public.guest_uploads;
drop policy if exists "guest_uploads insert" on public.guest_uploads;
drop policy if exists "guest_uploads delete" on public.guest_uploads;
create policy "guest_uploads select" on public.guest_uploads for select to anon, authenticated using (true);
create policy "guest_uploads insert" on public.guest_uploads for insert to anon, authenticated
  with check (
    file_size <= 52428800
    and (file_type like 'image/%' or file_type like 'video/%')
    and file_path not like '%..%'
  );
create policy "guest_uploads delete" on public.guest_uploads for delete to anon, authenticated using (true);

-- ─── Storage bucket (private, 50 MB per file, photos and videos only) ────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-uploads', 'guest-uploads', false, 52428800, array['image/*', 'video/*'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "guest-uploads insert" on storage.objects;
drop policy if exists "guest-uploads select" on storage.objects;
drop policy if exists "guest-uploads delete" on storage.objects;
create policy "guest-uploads insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'guest-uploads');
create policy "guest-uploads select" on storage.objects for select to anon, authenticated using (bucket_id = 'guest-uploads');
create policy "guest-uploads delete" on storage.objects for delete to anon, authenticated using (bucket_id = 'guest-uploads');
