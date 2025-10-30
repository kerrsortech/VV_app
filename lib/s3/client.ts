import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

/**
 * Extract the region code from AWS_REGION environment variable
 * Handles both formats:
 * - "ap-south-1" (just the code)
 * - "Asia Pacific (Mumbai) ap-south-1" (full name with code)
 */
function extractRegionCode(regionValue: string): string {
  if (!regionValue) {
    throw new Error("AWS_REGION environment variable is not set")
  }

  // If the value contains spaces, extract the last part (the region code)
  // Otherwise, use the value as-is
  const parts = regionValue.trim().split(/\s+/)
  const regionCode = parts[parts.length - 1]

  // Validate that we have a region code format (e.g., us-east-1, ap-south-1)
  if (!/^[a-z]{2}-[a-z]+-\d+$/.test(regionCode)) {
    throw new Error(
      `Invalid AWS region format: "${regionValue}". Expected format like "us-east-1" or "Asia Pacific (Mumbai) ap-south-1"`,
    )
  }

  return regionCode
}

const region = extractRegionCode(process.env.AWS_REGION!)

// Initialize S3 client with credentials from environment variables
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface PresignedUrlOptions {
  key: string // File path in S3 bucket
  contentType: string // MIME type of the file
  expiresIn?: number // URL expiration time in seconds (default: 3600 = 1 hour)
}

/**
 * Generate a presigned URL for uploading files directly to S3
 * This allows the client to upload files without going through the server
 */
export async function generatePresignedUrl({
  key,
  contentType,
  expiresIn = 3600,
}: PresignedUrlOptions): Promise<{ url: string; key: string }> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!

  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set")
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn })

  return { url, key }
}

/**
 * Get the public URL for an uploaded file
 */
export function getPublicUrl(key: string): string {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}

export { s3Client }
