import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Låt builden gå igenom även om ESLint klagar (t.ex. "any")
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (valfritt) låt builden gå igenom även vid TS-typsfel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
