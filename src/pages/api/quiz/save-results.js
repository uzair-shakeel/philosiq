import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    // Get quiz results from request body
    const {
      questions,
      answers,
      axisResults,
      archetype,
      secondaryArchetypes,
      quizType,
      timestamp,
    } = req.body;

    // Validate required data
    if (!axisResults || !archetype) {
      return res.status(400).json({
        success: false,
        message: "Missing required results data",
      });
    }

    // Save quiz results with complete data
    const result = await db.collection("quiz_results").insertOne({
      userId,
      questions,
      answers,
      // Save detailed axis results
      axisResults: axisResults.map((axis) => ({
        name: axis.name,
        score: axis.score,
        rawScore: axis.rawScore,
        leftLabel: axis.leftLabel,
        rightLabel: axis.rightLabel,
        userPosition: axis.userPosition,
        positionStrength: axis.positionStrength,
      })),
      // Save primary archetype
      archetype: {
        code: archetype.code,
        name: archetype.name,
        traits: archetype.traits,
      },
      // Save secondary archetypes
      secondaryArchetypes: secondaryArchetypes || [],
      // Additional metadata
      quizType,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Quiz results saved successfully",
      resultId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error saving quiz results:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save quiz results" });
  }
}
