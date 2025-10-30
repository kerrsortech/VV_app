/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack root to this project to avoid picking other lockfiles
  turbopack: {
    root: '.',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
