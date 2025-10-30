import { sql } from "@/lib/neon/db"
import { NextResponse } from "next/server"

// GET all projects
export async function GET(request: Request) {
  try {
    console.log("[v0] Fetching projects from database...")
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let projects

    if (search) {
      const searchPattern = `%${search}%`
      projects = await sql`
        SELECT * FROM projects 
        WHERE is_published = true 
        AND (
          title ILIKE ${searchPattern} OR 
          location ILIKE ${searchPattern} OR 
          description ILIKE ${searchPattern}
        )
        ORDER BY created_at DESC
      `
    } else if (category && category !== "all") {
      projects = await sql`
        SELECT * FROM projects 
        WHERE is_published = true AND category = ${category}
        ORDER BY created_at DESC
      `
    } else {
      projects = await sql`
        SELECT * FROM projects 
        WHERE is_published = true
        ORDER BY created_at DESC
      `
    }

    console.log(`[v0] Found ${projects.length} projects`)
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

    // Insert new project into Neon database
    const result = await sql`
      INSERT INTO projects (
        title, description, location, address, category,
        latitude, longitude, thumbnail_url, hero_image_url, model_url,
        rating, review_count, online_visitors, total_visitors, virtual_tours,
        highlights, visitor_tips, marketplace_links, badges, is_published
      ) VALUES (
        ${body.title}, ${body.description}, ${body.location}, ${body.address || null}, ${body.category},
        ${body.latitude}, ${body.longitude}, ${body.thumbnail_url || null}, ${body.hero_image_url || null}, ${body.model_url || null},
        ${body.rating || 0}, ${body.review_count || 0}, ${body.online_visitors || 0}, ${body.total_visitors || 0}, ${body.virtual_tours || 0},
        ${JSON.stringify(body.highlights || [])}, ${JSON.stringify(body.visitor_tips || [])}, ${JSON.stringify(body.marketplace_links || [])}, ${JSON.stringify(body.badges || [])}, ${body.is_published !== false}
      )
      RETURNING *
    `

    console.log("[v0] Created project:", result[0]?.id)
    return NextResponse.json({ project: result[0] }, { status: 201 })
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
