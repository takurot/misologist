-- Misologist Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists batches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  started_at timestamp with time zone not null,
  recipe_json jsonb not null default '{}',
  status text not null default 'active' check (status in ('active', 'completed', 'failed')),
  created_at timestamp with time zone not null default now()
);

create table if not exists logs (
  id uuid primary key default uuid_generate_v4(),
  batch_id uuid not null references batches(id) on delete cascade,
  captured_at timestamp with time zone not null default now(),
  photo_url text,
  env_json jsonb not null default '{}',
  diagnosis_json jsonb,
  action_json jsonb,
  created_at timestamp with time zone not null default now()
);

create table if not exists agent_sessions (
  id uuid primary key default uuid_generate_v4(),
  batch_id uuid not null references batches(id) on delete cascade,
  agent_state jsonb not null default '{}',
  last_action_at timestamp with time zone,
  next_action_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- Indexes
create index if not exists logs_batch_id_idx on logs(batch_id);
create index if not exists logs_captured_at_idx on logs(captured_at desc);
create index if not exists agent_sessions_batch_id_idx on agent_sessions(batch_id);

-- Row Level Security (disable for development, enable for production)
alter table batches enable row level security;
alter table logs enable row level security;
alter table agent_sessions enable row level security;

-- Development policy: allow all (replace with auth-based policies in production)
create policy "allow_all_batches" on batches for all using (true);
create policy "allow_all_logs" on logs for all using (true);
create policy "allow_all_agent_sessions" on agent_sessions for all using (true);

create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  miso_type text,
  koji_ratio numeric,
  salt_ratio numeric,
  soybean_variety text,
  water_content numeric,
  fermentation_duration text,
  notes text,
  is_template boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create index if not exists recipes_is_template_idx on recipes(is_template);

alter table recipes enable row level security;
create policy "allow_all_recipes" on recipes for all using (true);

-- Starter recipes
insert into recipes (name, description, miso_type, koji_ratio, salt_ratio, soybean_variety, fermentation_duration, is_template) values
  ('Sendai Miso', 'Rich red miso from northern Japan, bold and savory', 'red', 10, 13, 'Miyagi Shirome', '12–18 months', true),
  ('Kyoto White (Saikyo)', 'Mild, sweet white miso with low salt and high koji', 'white', 20, 5, 'Tanba Kurosaya', '2–3 weeks', true),
  ('Shinshu Yellow', 'Balanced all-purpose yellow miso from Nagano prefecture', 'yellow', 10, 12, 'Nakatejiro', '3–6 months', true)
on conflict do nothing;

-- Storage bucket for miso photos
insert into storage.buckets (id, name, public)
values ('miso-photos', 'miso-photos', true)
on conflict (id) do nothing;

create policy "allow_all_miso_photos" on storage.objects
  for all using (bucket_id = 'miso-photos');
