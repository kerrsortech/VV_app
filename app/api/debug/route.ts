import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      NEON_POSTGRES_URL: !!process.env.NEON_POSTGRES_URL,
      NEON_POSTGRES_PRISMA_URL: !!process.env.NEON_POSTGRES_PRISMA_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEON_PGHOST: !!process.env.NEON_PGHOST,
    }

    console.log("[v0] Environment variables check:", envVars)

    // Try to import and test the database connection
    let dbConnectionStatus = "not tested"
    let dbError = null

    try {
      const { sql } = await import("@/lib/neon/db")
      dbConnectionStatus = "imported successfully"

      // Try a simple query
      const result = await sql`SELECT 1 as test`
      dbConnectionStatus = "query successful"
      console.log("[v0] Database test query result:", result)

      // Check if projects table exists
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'projects'
        ) as table_exists
      `
      console.log("[v0] Projects table exists:", tableCheck[0])

      return NextResponse.json({
        status: "success",
        envVars,
        dbConnectionStatus,
        tableExists: tableCheck[0]?.table_exists,
      })
    } catch (error) {
      dbError = error instanceof Error ? error.message : String(error)
      console.error("[v0] Database connection error:", error)

      return NextResponse.json(
        {
          status: "error",
          envVars,
          dbConnectionStatus,
          dbError,
          errorStack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Debug endpoint error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
