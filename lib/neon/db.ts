import { neon } from "@neondatabase/serverless"

// Use NEON_DATABASE_URL which is automatically provided by Neon integration
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_POSTGRES_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please add your Neon database connection string to environment variables.")
}

const sql = neon(databaseUrl)

export { sql }

// Type definitions for the projects table
export interface Project {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  location: string
  address: string | null
  category: string
  latitude: number
  longitude: number
  rating: number | null
  review_count: number | null
  thumbnail_url: string | null
  hero_image_url: string | null
  model_url: string | null
  online_visitors: number | null
  total_visitors: number | null
  virtual_tours: number | null
  highlights: any[] | null
  visitor_tips: any[] | null
  marketplace_links: any[] | null
  badges: any[] | null
  is_published: boolean
}
