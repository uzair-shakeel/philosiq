import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await connectToDatabase();
    const questionsCollection = mongoose.connection.db.collection("questions");

    // Parse query parameters
    const limit = parseInt(req.query.limit) || 50;

    // Build query filter - only active questions for public endpoint
    const query = { active: true };

    // Apply additional filters if provided
    if (req.query.axis) query.axis = req.query.axis;

    // Only filter by includeInShortQuiz if explicitly provided
    if (req.query.includeInShortQuiz === "true") {
      query.includeInShortQuiz = true;
    } else if (req.query.includeInShortQuiz === "false") {
      query.includeInShortQuiz = { $ne: true };
    }
    // If includeInShortQuiz is not provided, return all questions regardless of that field

    // Get questions with optional limit
    let questions;
    if (limit > 0) {
      questions = await questionsCollection.find(query).limit(limit).toArray();
    } else {
      questions = await questionsCollection.find(query).toArray();
    }

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error fetching public questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
}
