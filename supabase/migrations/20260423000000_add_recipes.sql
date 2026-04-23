-- Add recipes table

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

-- Unique index on name for templates prevents duplicate starters on repeated runs
create unique index if not exists recipes_template_name_unique
  on recipes(name) where is_template = true;

alter table recipes enable row level security;
create policy "allow_all_recipes" on recipes for all using (true);

-- Starter recipes (idempotent via partial unique index)
insert into recipes (name, description, miso_type, koji_ratio, salt_ratio, soybean_variety, fermentation_duration, is_template) values
  ('Sendai Miso', 'Rich red miso from northern Japan, bold and savory', 'red', 10, 13, 'Miyagi Shirome', '12–18 months', true),
  ('Kyoto White (Saikyo)', 'Mild, sweet white miso with low salt and high koji', 'white', 20, 5, 'Tanba Kurosaya', '2–3 weeks', true),
  ('Shinshu Yellow', 'Balanced all-purpose yellow miso from Nagano prefecture', 'yellow', 10, 12, 'Nakatejiro', '3–6 months', true)
on conflict (name) where is_template = true do nothing;
