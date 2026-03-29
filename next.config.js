/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // FIX: added production domain — without this, server actions
      // are blocked on Vercel with a 403 CSRF error
      allowedOrigins: ["localhost:3000", "fluentai-zeta.vercel.app"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
