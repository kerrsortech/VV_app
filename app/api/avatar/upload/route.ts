import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
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
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        console.log("[v0] Blob upload completed:", blob.url)
        console.log("[v0] Token payload:", tokenPayload)

        // You can add database updates here if needed
        // For example, save the blob URL to your database
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Error in upload handler:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
