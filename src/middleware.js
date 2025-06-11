// This middleware runs on edge runtime
import { NextResponse } from "next/server";

// Simple CORS headers for the API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request) {
  // Log request details
  console.log(
    `[Middleware] ${request.method} request to ${request.nextUrl.pathname}`
  );

  // Only apply to the login API
  if (request.nextUrl.pathname !== "/api/auth/login") {
    return NextResponse.next();
  }

  // Handle OPTIONS request for login
  if (request.method === "OPTIONS") {
    console.log("[Middleware] Handling OPTIONS request");
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // For POST requests, add CORS headers
  const response = NextResponse.next();
  
  // Add the CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/auth/login",
};
