// Get the current domain based on environment
const getDomain = () => {
  if (typeof window !== "undefined") {
    // Client-side
    return window.location.origin;
  }

  // Server-side - determine by environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Default to localhost:3000 in development
  return process.env.NODE_ENV === "production"
    ? "https://philosiq.vercel.com"
    : "http://localhost:3000";
};

// Get allowed domains/origins for CORS
export const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://philosiq.vercel.com",
    "https://philosiq.vercel.app",
  ];

  // Add custom domains from env if they exist
  if (process.env.ALLOWED_ORIGINS) {
    origins.push(...process.env.ALLOWED_ORIGINS.split(","));
  }

  return origins;
};

// Get auth config based on current environment
export const getAuthConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    domain: getDomain(),
    cookiePrefix: "philosiq",
    cookieSecure: isProduction,
    cookieSameSite: isProduction ? "none" : "lax",
    allowedOrigins: getAllowedOrigins(),
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  };
};

export default getAuthConfig();
