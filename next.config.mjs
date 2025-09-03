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
  allowedDevOrigins: [
    "*",
    "*.fly.dev",
    "unhappy-bar.info",
    "trusty-fuel.org",
    "*.info",
    "*.org"
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Permissions-Policy', value: 'clipboard-read=(self), clipboard-write=(self)' },
        ],
      },
    ]
  },
}

export default nextConfig
