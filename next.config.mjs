/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow loading assets when embedded in external preview iframes (e.g., Builder.io)
  // Wildcards are safe in dev-only setting
  allowedDevOrigins: ["*", "*.info", "*.fly.dev"],
}

export default nextConfig
