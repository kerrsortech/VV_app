# Setup Guide - Virtual Tourism App

This application uses **Neon Postgres** for the database and **AWS S3** for file storage.

## 🚀 Quick Start

### 1. Database Setup (Neon)

The Neon integration is already connected! You just need to run the migration script:

1. Go to your [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to "SQL Editor"
4. Copy and paste the contents of `scripts/004_create_projects_table_neon.sql`
5. Click "Run" to create the projects table

**Environment Variable:** The `NEON_DATABASE_URL` is automatically provided by the Neon integration in v0.

### 2. AWS S3 Setup

#### Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `virtual-tourism-files`)
4. Select region (e.g., `us-east-1`)
5. **Uncheck** "Block all public access" (needed for public file access)
6. Click "Create bucket"

#### Configure CORS

1. Go to your bucket → Permissions → CORS
2. Add this configuration:

\`\`\`json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
\`\`\`

#### Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Users → Add users
3. User name: `virtual-tourism-app`
4. Select "Access key - Programmatic access"
5. Attach policies directly → Create policy:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME/*",
        "arn:aws:s3:::YOUR-BUCKET-NAME"
      ]
    }
  ]
}
\`\`\`

6. Save the **Access Key ID** and **Secret Access Key**

#### Add Environment Variables

Add these to your Vercel project (Settings → Environment Variables):

\`\`\`env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name-here
\`\`\`

## 📋 Environment Variables Checklist

- ✅ `DATABASE_URL` - Automatically provided by Neon integration
- ⬜ `AWS_ACCESS_KEY_ID` - From IAM user creation
- ⬜ `AWS_SECRET_ACCESS_KEY` - From IAM user creation  
- ⬜ `AWS_REGION` - Your S3 bucket region (e.g., us-east-1)
- ⬜ `AWS_S3_BUCKET_NAME` - Your S3 bucket name

## 🧪 Testing the Setup

1. **Create a Project**
   - Go to `/admin`
   - Fill in project details (title, description, location)
   - Add latitude/longitude coordinates
   - Upload thumbnail, hero image, and 3D model
   - Click "Create Project"

2. **Verify Database**
   - Check Neon SQL Editor: `SELECT * FROM projects;`
   - You should see your project data

3. **Verify S3 Storage**
   - Check your S3 bucket
   - You should see uploaded files in the bucket

4. **View on Map**
   - Go to `/map`
   - Your project should appear as a marker at the coordinates you specified

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router
- **Database**: Neon Postgres (serverless)
- **Storage**: AWS S3 (direct uploads via presigned URLs)
- **Styling**: Tailwind CSS + shadcn/ui
- **Maps**: Leaflet.js
- **3D Viewer**: Three.js with Gaussian Splatting

## 📝 Notes

- Files upload directly from browser to S3 (no server bottleneck)
- Database uses serverless Neon for automatic scaling
- No authentication required (public access for MVP)
- Add authentication later using Clerk or NextAuth

## 🐛 Troubleshooting

**"relation 'projects' does not exist"**
- Run the migration script in Neon SQL Editor

**"AWS credentials not found"**
- Add AWS environment variables in Vercel dashboard

**"CORS error on S3 upload"**
- Check CORS configuration in S3 bucket settings

**"Database connection failed"**
- Verify DATABASE_URL is set (should be automatic with Neon integration)
