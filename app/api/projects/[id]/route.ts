import { getSupabaseClient } from "@/lib/supabase/db"
import { NextResponse } from "next/server"

// GET single project by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseClient()

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[v0] Error in GET /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await getSupabaseClient()

    const { data: project, error } = await supabase
      .from("projects")
      .update({
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
        rating: body.rating,
        review_count: body.review_count,
        online_visitors: body.online_visitors,
        total_visitors: body.total_visitors,
        virtual_tours: body.virtual_tours,
        highlights: body.highlights,
        visitor_tips: body.visitor_tips,
        marketplace_links: body.marketplace_links,
        badges: body.badges,
        is_published: body.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[v0] Error in PUT /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseClient()

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
