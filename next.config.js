/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add this configuration to disable automatic static optimization for specific pages
  // This can help with navigation issues
  unstable_runtimeJS: true,
  // Disable page transitions that might cause issues
  pageExtensions: ["jsx", "js", "tsx", "ts"],
};

module.exports = nextConfig;
