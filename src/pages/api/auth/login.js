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
      ...details,
    })
  );
};

export default async function handler(req, res) {
  logRequest(req, "start");

  // Set CORS headers immediately
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    logRequest(req, "options_response");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    logRequest(req, "method_not_allowed", { received: req.method });
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }

  try {
    logRequest(req, "processing_request", {
      bodyKeys: req.body ? Object.keys(req.body) : [],
      bodyLength: req.body ? JSON.stringify(req.body).length : 0,
    });

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      logRequest(req, "validation_failed", {
        hasEmail: !!email,
        hasPassword: !!password,
      });

      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Connect to database
    logRequest(req, "connecting_to_db");
    const { db } = await connectToDatabase();

    // Find user
    logRequest(req, "finding_user", { email });
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      logRequest(req, "user_not_found", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify password
    logRequest(req, "verifying_password");
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      logRequest(req, "invalid_password", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create token with user ID as string
    logRequest(req, "creating_token", { userId: user._id.toString() });
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success with token and user info
    logRequest(req, "login_success", { userId: user._id.toString() });
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
    logRequest(req, "error", {
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
