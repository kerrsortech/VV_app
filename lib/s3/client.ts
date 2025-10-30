import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client with credentials from environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
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
  const region = process.env.AWS_REGION!

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}

export { s3Client }
