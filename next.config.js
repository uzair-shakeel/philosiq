/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add this configuration to disable automatic static optimization for specific pages
  // This can help with navigation issues
  unstable_runtimeJS: true,
};

module.exports = nextConfig;
