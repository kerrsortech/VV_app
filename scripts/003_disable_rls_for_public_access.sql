-- Disable Row Level Security on projects table to allow public access
-- This makes the app fully public without authentication requirements
-- RLS can be re-enabled later when authentication is implemented

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to keep RLS enabled but allow public access, 
-- uncomment the following lines instead of disabling RLS:
-- 
-- CREATE POLICY "Allow public read access" ON projects
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public insert access" ON projects
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public update access" ON projects
--   FOR UPDATE USING (true);
-- 
-- CREATE POLICY "Allow public delete access" ON projects
--   FOR DELETE USING (true);
