import { connectToDatabase } from "../../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// You would need to set up a secure JWT_SECRET in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with a real secret in production

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create token with user ID as string
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success with token and user info
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
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
}
