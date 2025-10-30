import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let _sql: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql

  const databaseUrl =
    process.env.NEON_NEON_DATABASE_URL ||
    process.env.NEON_POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.NEON_POSTGRES_PRISMA_URL

  if (!databaseUrl) {
    const availableVars = {
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      NEON_POSTGRES_URL: !!process.env.NEON_POSTGRES_URL,
      NEON_POSTGRES_PRISMA_URL: !!process.env.NEON_POSTGRES_PRISMA_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }
    console.error("[v0] No Neon database URL found. Available env vars:", availableVars)
    throw new Error(
      "Neon database URL is not configured. Please add NEON_DATABASE_URL or NEON_POSTGRES_URL in the Vars section of the sidebar.",
    )
  }

  console.log("[v0] Initializing Neon connection with URL:", databaseUrl.substring(0, 30) + "...")
  _sql = neon(databaseUrl)
  return _sql
}

export function sql(strings: TemplateStringsArray, ...values: any[]) {
  const sqlInstance = getSql()
  return sqlInstance(strings, ...values)
}

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
