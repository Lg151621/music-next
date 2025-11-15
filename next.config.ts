// next.config.ts
import type { NextConfig } from "next";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://cst-391-music-app.vercel.app";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Wikipedia images
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // Amazon album covers
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify covers
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash
      },
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com", // Apple Music / iTunes
      },
      {
        protocol: "https",
        hostname: "is2-ssl.mzstatic.com", // Apple CDN variant
      },
      {
        protocol: "https",
        hostname: "is3-ssl.mzstatic.com", // Apple CDN variant
      },
      {
        protocol: "https",
        hostname: "is4-ssl.mzstatic.com", // Apple CDN variant
      },
    ],
  },
  async rewrites() {
    
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_BASE}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
