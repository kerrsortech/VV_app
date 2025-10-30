import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET all projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const supabase = await createClient()

    const { data: tables, error: tableError } = await supabase.from("projects").select("id").limit(1)

    if (tableError) {
      console.error("[v0] Database error (table might not exist):", tableError)
      // Return empty array if table doesn't exist yet
      if (tableError.message.includes("does not exist") || tableError.message.includes("not found")) {
        return NextResponse.json({
          projects: [],
          message: "Database not initialized. Please run the SQL scripts first.",
        })
      }
      return NextResponse.json({ error: tableError.message }, { status: 500 })
    }

    let query = supabase.from("projects").select("*").eq("is_published", true).order("created_at", { ascending: false })

    // Filter by category if provided
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // Search by title, location, or description
    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching projects:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects: data || [] })
  } catch (error) {
    console.error("[v0] Error in GET /api/projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // No auth required - anyone can create projects for now

    const body = await request.json()

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: body.title,
        description: body.description,
        location: body.location,
        address: body.address,
        category: body.category,
        latitude: body.latitude,
        longitude: body.longitude,
        thumbnail_url: body.thumbnail_url,
        hero_image_url: body.hero_image_url,
        model_url: body.model_url,
        rating: body.rating || 0,
        review_count: body.review_count || 0,
        online_visitors: body.online_visitors || 0,
        total_visitors: body.total_visitors || 0,
        virtual_tours: body.virtual_tours || 0,
        highlights: body.highlights || [],
        visitor_tips: body.visitor_tips || [],
        marketplace_links: body.marketplace_links || [],
        badges: body.badges || [],
        is_published: body.is_published !== false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating project:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
