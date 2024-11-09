/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['https://liwan-back.vercel.app'],
  },
};

export default nextConfig;