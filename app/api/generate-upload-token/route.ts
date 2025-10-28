import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { filename } = await request.json()

    console.log("[SERVER][v0] Generating upload token for:", filename)

    // Generate a unique filename with timestamp
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${filename}`

    // For client uploads, we need to return the token and URL
    // The client will upload directly to Blob storage
    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN not found")
    }

    // Return the necessary information for client-side upload
    return NextResponse.json({
      url: `https://blob.vercel-storage.com`,
      token: token,
      pathname: `projects/${uniqueFilename}`,
    })
  } catch (error) {
    console.error("[SERVER][v0] Error generating upload token:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate upload token" },
      { status: 500 },
    )
  }
}
