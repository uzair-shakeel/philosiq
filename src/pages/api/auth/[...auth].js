import { connectToDatabase } from "../../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// You would need to set up a secure JWT_SECRET in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with a real secret in production

// Helper for structured logging
const logRequest = (req, stage, details = {}) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      stage,
      method: req.method,
      url: req.url,
      headers: req.headers,
      path: req.query.auth,
      ...details,
    })
  );
};

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  logRequest(req, "start_catchall", { query: req.query });

  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    logRequest(req, "options_response_catchall");
    return res.status(200).end();
  }

  // Get the route from the URL
  const authPath = req.query.auth || [];
  const route = authPath[0];

  // Route to appropriate handler
  if (route === "login") {
    return handleLogin(req, res);
  }

  // If no matching route, return 404
  return res.status(404).json({
    success: false,
    message: `Route not found: /api/auth/${authPath.join("/")}`,
  });
}

// Login handler function
async function handleLogin(req, res) {
  // Force method to uppercase for consistency
  const method = req.method.toUpperCase();

  if (method !== "POST") {
    logRequest(req, "method_not_allowed_catchall", { received: method });
    return res
      .status(405)
      .json({
        success: false,
        message: `Method ${method} not allowed, only POST is supported`,
      });
  }

  try {
    logRequest(req, "processing_login_catchall");

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      logRequest(req, "validation_failed_catchall", {
        hasEmail: !!email,
        hasPassword: !!password,
      });

      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Connect to database
    logRequest(req, "connecting_to_db_catchall");
    const { db } = await connectToDatabase();

    // Find user
    logRequest(req, "finding_user_catchall", { email });
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      logRequest(req, "user_not_found_catchall", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify password
    logRequest(req, "verifying_password_catchall");
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      logRequest(req, "invalid_password_catchall", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create token with user ID as string
    logRequest(req, "creating_token_catchall", { userId: user._id.toString() });
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success with token and user info
    logRequest(req, "login_success_catchall", { userId: user._id.toString() });
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logRequest(req, "error_catchall", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
}
