"use server"

import { put } from "@vercel/blob"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      throw new Error("No file provided")
    }

    console.log(`[v0] Uploading file: ${file.name}, size: ${file.size} bytes`)

    const blob = await put(`${folder}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log(`[v0] File uploaded successfully: ${blob.url}`)

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}
