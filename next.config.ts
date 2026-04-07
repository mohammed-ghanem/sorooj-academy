import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.wecandevmode.online",
      },
      
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;