import { neon } from "@neondatabase/serverless"

const databaseUrl =
  process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.NEON_NEON_DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] Available Neon env vars:", {
    NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
    NEON_POSTGRES_URL: !!process.env.NEON_POSTGRES_URL,
    NEON_POSTGRES_PRISMA_URL: !!process.env.NEON_POSTGRES_PRISMA_URL,
  })
  throw new Error(
    "Neon database URL is not set. Please check your Neon integration in the Connect section. " +
      "Expected NEON_DATABASE_URL or NEON_POSTGRES_URL environment variable.",
  )
}

console.log("[v0] Connecting to Neon database:", databaseUrl.substring(0, 30) + "...")

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
