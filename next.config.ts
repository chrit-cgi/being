/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // DIT IS DE BELANGRIJKE REGEL:
    ignoreBuildErrors: true,
  },
};

export default nextConfig;