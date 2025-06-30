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

    // Get all questions without any filtering or limits
    const questions = await questionsCollection.find({}).toArray();

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching all questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
}
