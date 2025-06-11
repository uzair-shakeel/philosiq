/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add this configuration to disable automatic static optimization for specific pages
  // This can help with navigation issues
  unstable_runtimeJS: true,
  // Disable page transitions that might cause issues
  pageExtensions: ["jsx", "js", "tsx", "ts"],
  // Add CORS headers for login API
  async headers() {
    return [
      {
        // Apply these headers to login API
        source: "/api/auth/login",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
