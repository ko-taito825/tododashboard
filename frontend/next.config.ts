import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /api/v1/* is handled by app/api/v1/[...path]/route.ts (auth proxy)
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
