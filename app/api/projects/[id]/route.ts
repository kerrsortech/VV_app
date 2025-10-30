import { sql } from "@/lib/neon/db"
import { NextResponse } from "next/server"

// GET single project by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const result = await sql`
      SELECT * FROM projects 
      WHERE id = ${id} 
      AND is_published = true 
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: result[0] })
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

    const result = await sql`
      UPDATE projects SET
        title = ${body.title},
        description = ${body.description},
        location = ${body.location},
        address = ${body.address},
        category = ${body.category},
        latitude = ${body.latitude},
        longitude = ${body.longitude},
        thumbnail_url = ${body.thumbnail_url},
        hero_image_url = ${body.hero_image_url},
        model_url = ${body.model_url},
        rating = ${body.rating},
        review_count = ${body.review_count},
        online_visitors = ${body.online_visitors},
        total_visitors = ${body.total_visitors},
        virtual_tours = ${body.virtual_tours},
        highlights = ${JSON.stringify(body.highlights)}::jsonb,
        visitor_tips = ${JSON.stringify(body.visitor_tips)}::jsonb,
        marketplace_links = ${JSON.stringify(body.marketplace_links)}::jsonb,
        badges = ${JSON.stringify(body.badges)}::jsonb,
        is_published = ${body.is_published},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: result[0] })
  } catch (error) {
    console.error("[v0] Error in PUT /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await sql`
      DELETE FROM projects 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
