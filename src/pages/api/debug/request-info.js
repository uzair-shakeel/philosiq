// API route to debug request issues

export default function handler(req, res) {
  // Allow all HTTP methods for this debug endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Get request details
  const requestInfo = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    cookies: req.cookies,
    body: req.body || {},
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      nextVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
    },
  };

  // Return request info as JSON
  return res.status(200).json({
    success: true,
    request: requestInfo,
  });
}
