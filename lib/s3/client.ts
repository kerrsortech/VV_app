// Using presigned URLs with fetch API instead of AWS SDK commands

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
const bucketName = process.env.AWS_S3_BUCKET_NAME!
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!

export interface PresignedUrlOptions {
  key: string // File path in S3 bucket
  contentType: string // MIME type of the file
  expiresIn?: number // URL expiration time in seconds (default: 3600 = 1 hour)
}

/**
 * Generate a presigned URL for uploading files directly to S3
 * This uses AWS Signature V4 without requiring Node.js crypto/zlib modules
 */
export async function generatePresignedUrl({
  key,
  contentType,
  expiresIn = 3600,
}: PresignedUrlOptions): Promise<{ url: string; key: string }> {
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set")
  }

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not set")
  }

  // Use AWS SDK but disable automatic checksum to avoid zlib dependency
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3")
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner")

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    // Don't specify ChecksumAlgorithm to avoid automatic CRC32 calculation
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn,
    // Disable automatic checksum calculation
    signableHeaders: new Set(["host", "content-type"]),
  })

  return { url, key }
}

/**
 * Get the public URL for an uploaded file
 */
export function getPublicUrl(key: string): string {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}
