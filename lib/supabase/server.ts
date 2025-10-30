import { sql } from "@/lib/neon/db"

// This file maintains the same interface for backward compatibility
// but now uses Neon Postgres instead of Supabase
export async function createClient() {
  // Return an object that mimics the Supabase client interface
  // but uses Neon SQL queries under the hood
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            try {
              const result = await sql`
                SELECT ${sql.raw(columns)} 
                FROM ${sql.raw(table)} 
                WHERE ${sql.raw(column)} = ${value}
                LIMIT 1
              `
              return { data: result[0] || null, error: null }
            } catch (error: any) {
              return { data: null, error }
            }
          },
          limit: async (limit: number) => {
            try {
              const result = await sql`
                SELECT ${sql.raw(columns)} 
                FROM ${sql.raw(table)} 
                WHERE ${sql.raw(column)} = ${value}
                LIMIT ${limit}
              `
              return { data: result, error: null }
            } catch (error: any) {
              return { data: null, error }
            }
          },
        }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          async then(resolve: any) {
            try {
              const direction = options?.ascending ? "ASC" : "DESC"
              const result = await sql`
                SELECT ${sql.raw(columns)} 
                FROM ${sql.raw(table)} 
                ORDER BY ${sql.raw(column)} ${sql.raw(direction)}
              `
              resolve({ data: result, error: null })
            } catch (error: any) {
              resolve({ data: null, error })
            }
          },
        }),
        limit: async (limit: number) => {
          try {
            const result = await sql`
              SELECT ${sql.raw(columns)} 
              FROM ${sql.raw(table)} 
              LIMIT ${limit}
            `
            return { data: result, error: null }
          } catch (error: any) {
            return { data: null, error }
          }
        },
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            try {
              const keys = Object.keys(data)
              const values = Object.values(data)
              const result = await sql`
                INSERT INTO ${sql.raw(table)} (${sql.raw(keys.join(", "))})
                VALUES (${sql.raw(values.map((_, i) => `$${i + 1}`).join(", "))})
                RETURNING *
              `.values(...values)
              return { data: result[0], error: null }
            } catch (error: any) {
              return { data: null, error }
            }
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              try {
                const updates = Object.entries(data)
                  .map(([key], i) => `${key} = $${i + 1}`)
                  .join(", ")
                const result = await sql`
                  UPDATE ${sql.raw(table)}
                  SET ${sql.raw(updates)}
                  WHERE ${sql.raw(column)} = ${value}
                  RETURNING *
                `.values(...Object.values(data))
                return { data: result[0], error: null }
              } catch (error: any) {
                return { data: null, error }
              }
            },
          }),
        }),
      }),
      delete: () => ({
        eq: async (column: string, value: any) => {
          try {
            await sql`
              DELETE FROM ${sql.raw(table)}
              WHERE ${sql.raw(column)} = ${value}
            `
            return { error: null }
          } catch (error: any) {
            return { error }
          }
        },
      }),
    }),
  }
}
