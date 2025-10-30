-- Neon Database Migration: Create projects table
-- Run this in your Neon SQL Editor to set up the database

-- Create projects table for virtual tourism destinations
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  category TEXT NOT NULL,
  
  -- Coordinates for map visualization
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  
  -- Media URLs (stored in AWS S3)
  thumbnail_url TEXT,
  hero_image_url TEXT,
  model_url TEXT,
  
  -- Stats
  rating NUMERIC(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  online_visitors INTEGER DEFAULT 0,
  total_visitors INTEGER DEFAULT 0,
  virtual_tours INTEGER DEFAULT 0,
  
  -- Additional Data (JSON for flexibility)
  highlights JSONB DEFAULT '[]'::jsonb,
  visitor_tips JSONB DEFAULT '[]'::jsonb,
  marketplace_links JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  is_published BOOLEAN DEFAULT true
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_coordinates ON projects(latitude, longitude);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: No RLS policies for now (public access)
-- Add authentication and RLS policies later when implementing user management
