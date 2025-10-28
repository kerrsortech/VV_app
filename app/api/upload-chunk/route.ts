import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Store chunks temporarily in memory (in production, use a database or temp storage)
const uploadSessions = new Map<string, { chunks: Buffer[]; filename: string; totalChunks: number }>()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const chunk = formData.get("chunk") as File
    const chunkIndex = Number.parseInt(formData.get("chunkIndex") as string)
    const totalChunks = Number.parseInt(formData.get("totalChunks") as string)
    const sessionId = formData.get("sessionId") as string
    const filename = formData.get("filename") as string
    const folder = formData.get("folder") as string

    console.log(`[SERVER][v0] Received chunk ${chunkIndex + 1}/${totalChunks} for ${filename}`)

    // Convert chunk to buffer
    const arrayBuffer = await chunk.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Initialize or get session
    if (!uploadSessions.has(sessionId)) {
      uploadSessions.set(sessionId, {
        chunks: new Array(totalChunks),
        filename,
        totalChunks,
      })
    }

    const session = uploadSessions.get(sessionId)!
    session.chunks[chunkIndex] = buffer

    // Check if all chunks are received
    const allChunksReceived = session.chunks.every((c) => c !== undefined)

    if (allChunksReceived) {
      console.log(`[SERVER][v0] All chunks received for ${filename}, combining and uploading to Blob...`)

      // Combine all chunks
      const completeFile = Buffer.concat(session.chunks)

      // Upload to Vercel Blob
      const blob = await put(`${folder}/${Date.now()}-${filename}`, completeFile, {
        access: "public",
      })

      // Clean up session
      uploadSessions.delete(sessionId)

      console.log(`[SERVER][v0] File uploaded successfully:`, blob.url)

      return NextResponse.json({
        success: true,
        url: blob.url,
        complete: true,
      })
    }

    // Return progress
    return NextResponse.json({
      success: true,
      complete: false,
      progress: ((chunkIndex + 1) / totalChunks) * 100,
    })
  } catch (error) {
    console.error("[SERVER][v0] Error uploading chunk:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload chunk",
      },
      { status: 500 },
    )
  }
}
