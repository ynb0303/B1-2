-- 과제용 공개 공유 기록장: 모든 방문자에게 CRUD를 허용합니다.
-- 개인/민감 정보 저장용이 아닙니다. 개인 서비스로 전환할 때 Auth와 소유자 정책이 필요합니다.
create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 80),
  content text not null check (char_length(trim(content)) between 1 and 5000),
  category text not null check (category in ('React', 'JavaScript', 'CSS', '기타')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.set_record_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists records_updated_at on public.records;
create trigger records_updated_at before update on public.records
for each row execute function public.set_record_updated_at();
alter table public.records enable row level security;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.records to anon, authenticated;
drop policy if exists "Public exercise CRUD" on public.records;
create policy "Public exercise CRUD" on public.records for all to anon, authenticated using (true) with check (true);
