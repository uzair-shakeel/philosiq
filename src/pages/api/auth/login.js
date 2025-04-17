import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { connectToDatabase } from "../../../lib/mongodb";

// You would need to set up a secure JWT_SECRET in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with a real secret in production

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Connect to database
    const { db } = await connectToDatabase();

    // Find user by email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return token only
    return res.status(200).json({
      success: true,
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
