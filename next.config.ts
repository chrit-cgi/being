import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vertel Next.js om Prisma niet te proberen te 'bundelen'
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
