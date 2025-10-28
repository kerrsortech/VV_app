import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  console.log("[v0] Upload URL API called")

  try {
    const body = (await request.json()) as HandleUploadBody
    console.log("[v0] Request body received:", JSON.stringify(body).substring(0, 200))

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log("[v0] Generating upload token for:", pathname)
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/octet-stream"],
          maximumSizeInBytes: 5 * 1024 * 1024 * 1024, // 5GB limit
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[v0] Upload completed:", blob.url)
      },
    })

    console.log("[v0] Upload URL generated successfully")
    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Error in upload URL API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate upload URL" },
      { status: 500 },
    )
  }
}
