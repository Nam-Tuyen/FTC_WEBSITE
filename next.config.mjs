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
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverExternalPackages: [
    '@genkit-ai/core',
    '@genkit-ai/googleai', 
    'genkit',
    '@opentelemetry/sdk-node',
    '@opentelemetry/api',
    'handlebars'
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore problematic modules on server side
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        'handlebars': 'commonjs handlebars'
      });
    }
    
    // Handle require.extensions warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
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
