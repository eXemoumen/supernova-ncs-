import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/dashboard/:path*',
        destination: 'http://localhost:3001/api/dashboard/:path*',
      },
    ];
  },
};

export default nextConfig;
