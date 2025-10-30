import { generatePresignedUrl } from "@/lib/s3/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { filename, contentType } = body

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and content type are required" }, { status: 400 })
    }

    // Generate a unique key for the file
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(7)
    const key = `uploads/${timestamp}-${randomSuffix}-${filename}`

    console.log("[v0] Generating presigned URL for:", key)

    // Generate presigned URL for direct S3 upload
    const { url } = await generatePresignedUrl({
      key,
      contentType,
      expiresIn: 3600, // 1 hour
    })

    console.log("[v0] Presigned URL generated successfully")

    return NextResponse.json({ uploadUrl: url, key })
  } catch (error) {
    console.error("[v0] Error generating presigned URL:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate upload URL",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to retrieve the public URL for an uploaded file
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "Key parameter is required" }, { status: 400 })
    }

    const { getPublicUrl } = await import("@/lib/s3/client")
    const publicUrl = getPublicUrl(key)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("[v0] Error getting public URL:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get public URL",
      },
      { status: 500 },
    )
  }
}
