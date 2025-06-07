import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get auth token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify JWT token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to database
    const { db } = await connectToDatabase();

    // Get user from database
    const user = await db.collection("users").findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Get quiz results for user
    const results = await db
      .collection("quiz_results")
      .find({ userId: user._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Failed to fetch quiz results" });
  }
} 