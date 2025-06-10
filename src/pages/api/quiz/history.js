import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Convert string ID to ObjectId
    const userId = new ObjectId(decoded.userId);

    // Check if user exists
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Fetch quiz results for this user
    const results = await db
      .collection("quiz_results")
      .find({ userId })
      .sort({ createdAt: -1 }) // Sort by date, newest first
      .toArray();

    // Transform the results to include string _id for easier frontend handling
    const transformedResults = results.map(result => ({
      ...result,
      _id: result._id.toString(),
      userId: result.userId.toString()
    }));

    return res.status(200).json({
      success: true,
      message: "Quiz history retrieved successfully",
      results: transformedResults
    });
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch quiz history" });
  }
} 