// next.config.ts
import type { NextConfig } from "next";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://cst-391-music-app.vercel.app";

const nextConfig: NextConfig = {
  // ✅ keep your current backend rewrites exactly the same
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/:path*"
            : `${BACKEND_BASE}/api/:path*`,
      },
    ];
  },

  // ✅ Add image domain configuration for Next.js Image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // for album covers
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // optional fallback
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // optional: Spotify-like covers
      },
    ],
  },
};

export default nextConfig;
