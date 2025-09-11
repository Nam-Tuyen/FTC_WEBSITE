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
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
    const enable = process.env.ENABLE_API_PROXY === 'true' && backend
    return enable ? [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`
      }
    ] : []
  }
}

export default nextConfig
