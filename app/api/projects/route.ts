import { getSupabaseClient } from "@/lib/supabase/db"
import { NextResponse } from "next/server"

// GET all projects
export async function GET(request: Request) {
  try {
    console.log("[v0] Fetching projects from Supabase database...")
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const supabase = await getSupabaseClient()

    let query = supabase.from("projects").select("*").eq("is_published", true)

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data: projects, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log(`[v0] Found ${projects?.length || 0} projects`)
    return NextResponse.json({ projects: projects || [] })
  } catch (error) {
    console.error("[v0] Error in GET /api/projects:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        projects: [],
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await getSupabaseClient()

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        title: body.title,
        description: body.description,
        location: body.location,
        address: body.address || null,
        category: body.category,
        latitude: body.latitude,
        longitude: body.longitude,
        thumbnail_url: body.thumbnail_url || null,
        hero_image_url: body.hero_image_url || null,
        model_url: body.model_url || null,
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
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Created project:", project?.id)
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/projects:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
