import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server components/route handlers read data/generated/*.json via a runtime-built path
  // (not a static import), so Next's file tracer can't discover it on its own — without
  // this, the serverless bundle would be missing the data files in production.
  outputFileTracingIncludes: {
    "/*": ["./data/generated/**/*.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

export default nextConfig;
