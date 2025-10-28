import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file extension
    const fileName = file.name.toLowerCase()
    const validExtensions = [".ply", ".splat", ".ksplat"]
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!hasValidExtension) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a .ply, .splat, or .ksplat file" },
        { status: 400 },
      )
    }

    // Upload to Vercel Blob
    const timestamp = Date.now()
    const extension = fileName.substring(fileName.lastIndexOf("."))
    const uniqueFileName = `splats/${timestamp}${extension}`

    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("[v0] File uploaded to Blob:", blob.url)

    // Return the Blob URL directly
    return NextResponse.json({ url: blob.url, filename: uniqueFileName })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
