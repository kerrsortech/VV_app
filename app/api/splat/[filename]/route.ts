import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  // This route is deprecated - files should be accessed via Blob URLs directly
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Files are now served directly from Vercel Blob storage.",
      message: "Please use the Blob URL returned from the upload endpoint.",
    },
    { status: 410 },
  )
}
