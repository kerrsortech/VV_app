import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/octet-stream", // For .splat files
            "model/gltf-binary",
            "model/gltf+json",
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB limit
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[v0] Upload complete:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Error in upload handler:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
