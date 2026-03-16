import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: false,
    serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
