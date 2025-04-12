// This API route handles CORS preflight requests for authentication
export default function handler(req, res) {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allow credentials to be included
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Allow specific methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Allow specific headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // For actual requests, just send a success response
  res.status(200).json({ success: true });
}
