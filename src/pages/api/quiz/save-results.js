import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  console.log("Received save-results request");

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided in request");
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified for user:", decoded.userId);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    console.log("Connected to database");

    // Convert string ID to ObjectId
    const userId = new ObjectId(decoded.userId);

    // Check if user exists
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      console.log("User not found:", decoded.userId);
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    console.log("User found:", user._id.toString());

    // Get data from request body
    const { archetype, secondaryArchetypes, axisBreakdown, quizType } =
      req.body;

    // Normalize secondaryArchetypes
    let normalizedSecondaryArchetypes = [];
    if (Array.isArray(secondaryArchetypes)) {
      normalizedSecondaryArchetypes = secondaryArchetypes;
    } else if (secondaryArchetypes && typeof secondaryArchetypes === "object") {
      normalizedSecondaryArchetypes = Object.values(secondaryArchetypes);
    }

    // Normalize axisBreakdown
    let normalizedAxisBreakdown = [];
    if (Array.isArray(axisBreakdown)) {
      normalizedAxisBreakdown = axisBreakdown;
    } else if (axisBreakdown && typeof axisBreakdown === "object") {
      normalizedAxisBreakdown = Object.values(axisBreakdown);
    }

    console.log("Received archetype data:", JSON.stringify(archetype));
    console.log(
      "Received secondary archetypes:",
      JSON.stringify(normalizedSecondaryArchetypes)
    );
    console.log(
      "Received axis breakdown:",
      JSON.stringify(normalizedAxisBreakdown)
    );
    console.log("Received quiz type:", quizType || "not specified");

    // Validate required data
    if (!req.body.archetype) {
      console.error("Missing archetype object:", JSON.stringify(req.body));
      return res.status(400).json({
        success: false,
        message: "Missing archetype object",
      });
    }
    if (!req.body.archetype.name) {
      console.error("Missing archetype name:", JSON.stringify(req.body));
      return res.status(400).json({
        success: false,
        message: "Missing archetype name",
      });
    }
    if (!req.body.archetype.traits) {
      console.error("Missing archetype traits:", JSON.stringify(req.body));
      return res.status(400).json({
        success: false,
        message: "Missing archetype traits",
      });
    }

    console.log("Saving new result for user:", user._id.toString());

    // Log the complete data structure being saved
    console.log("Complete data structure being saved:", {
      userId,
      archetype: {
        name: archetype.name,
        traits: archetype.traits,
      },
      secondaryArchetypes: normalizedSecondaryArchetypes,
      axisBreakdown: normalizedAxisBreakdown,
      createdAt: new Date(),
      quizType: req.body.quizType || "full", // Add quizType if provided
    });

    // Always create a new document for each quiz result
    const result = await db.collection("quiz_results").insertOne({
      userId,
      archetype: {
        name: archetype.name,
        traits: archetype.traits,
      },
      secondaryArchetypes: normalizedSecondaryArchetypes,
      axisBreakdown: normalizedAxisBreakdown,
      quizType: quizType || "full", // Add the quiz type
      createdAt: new Date(),
    });

    console.log(
      "Database operation result:",
      JSON.stringify({
        insertedId: result.insertedId,
      })
    );

    return res.status(200).json({
      success: true,
      message: "Results saved successfully",
      resultId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error saving results:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save results" });
  }
}
