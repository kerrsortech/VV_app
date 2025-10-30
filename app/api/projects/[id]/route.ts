import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET single project by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).eq("is_published", true).single()

    if (error) {
      console.error("[v0] Error fetching project:", error)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error("[v0] Error in GET /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update project
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const body = await request.json()

    const { data, error } = await supabase.from("projects").update(body).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating project:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error("[v0] Error in PUT /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting project:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/projects/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
