// next.config.ts
import type { NextConfig } from "next";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://cst-391-music-app.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dev → your local Express API
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/:path*"
            : `${BACKEND_BASE}/api/:path*`, // Prod → your deployed API
      },
    ];
  },
};

export default nextConfig;
