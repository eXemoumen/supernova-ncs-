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
  async rewrites() {
    return [
      {
        source: '/api/dashboard/:path*',
        destination: 'http://localhost:3001/api/dashboard/:path*',
      },
      {
        source: '/api/clients/:path*',
        destination: 'http://localhost:3001/api/clients/:path*',
      },
      {
        source: '/api/campaigns/:path*',
        destination: 'http://localhost:3001/api/campaigns/:path*',
      },
      {
        source: '/api/content-ideas/:path*',
        destination: 'http://localhost:3001/api/content-ideas/:path*',
      },
      {
        source: '/api/marketing-data/:path*',
        destination: 'http://localhost:3001/api/marketing-data/:path*',
      },
    ];
  },
}

export default nextConfig
