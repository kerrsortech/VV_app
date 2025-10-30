import { createClient } from "@/lib/supabase/server"

export async function getSupabaseClient() {
  return await createClient()
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
