-- Create projects table for virtual tourism destinations
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic Information
  title text not null,
  description text not null,
  location text not null,
  address text not null,
  category text not null,
  
  -- Coordinates
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  
  -- Media URLs (stored in Vercel Blob)
  thumbnail_url text not null,
  hero_image_url text,
  model_url text not null,
  
  -- Stats
  rating numeric(2, 1) default 0,
  review_count integer default 0,
  online_visitors integer default 0,
  total_visitors integer default 0,
  virtual_tours integer default 0,
  
  -- Additional Data (JSON for flexibility)
  highlights jsonb default '[]'::jsonb,
  visitor_tips jsonb default '[]'::jsonb,
  marketplace_links jsonb default '[]'::jsonb,
  badges jsonb default '[]'::jsonb,
  
  -- Status
  is_published boolean default true
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Policy: Anyone can view published projects
create policy "projects_select_published"
  on public.projects for select
  using (is_published = true);

-- Policy: Authenticated users can insert projects (for admin)
create policy "projects_insert_authenticated"
  on public.projects for insert
  to authenticated
  with check (true);

-- Policy: Authenticated users can update projects (for admin)
create policy "projects_update_authenticated"
  on public.projects for update
  to authenticated
  using (true);

-- Policy: Authenticated users can delete projects (for admin)
create policy "projects_delete_authenticated"
  on public.projects for delete
  to authenticated
  using (true);

-- Create index for faster queries
create index if not exists projects_category_idx on public.projects(category);
create index if not exists projects_location_idx on public.projects(location);
create index if not exists projects_published_idx on public.projects(is_published);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();
