import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

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
    const userId = decoded.userId;
    const filter =
      typeof userId === "string"
        ? { _id: new ObjectId(userId) }
        : { _id: userId };
    const user = await db.collection("users").findOne(filter);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return user data without sensitive information
    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Failed to fetch user data" });
  }
}
