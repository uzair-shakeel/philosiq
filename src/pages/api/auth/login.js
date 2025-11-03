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
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7000d" }
    );

    // Return success with token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
}
