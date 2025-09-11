/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["jsx", "js", "tsx", "ts"],
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  // Add this if you're using Next.js 12+ and have async API routes
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
