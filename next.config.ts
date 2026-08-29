import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  transpilePackages: ["three"],
  // Litigation moved from /litigation to the root route when it became the
  // primary practice area. Keep the old path working for anything already
  // linking to it.
  async redirects() {
    return [{ source: "/litigation", destination: "/", permanent: true }];
  },
};

export default nextConfig;
