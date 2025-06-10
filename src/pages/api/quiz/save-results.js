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

    // Get archetype data from request body
    const { archetype, secondaryArchetypes } = req.body;
    console.log("Received archetype data:", JSON.stringify(archetype));
    console.log(
      "Received secondary archetypes:",
      JSON.stringify(secondaryArchetypes)
    );

    // Validate required data
    if (!archetype || !archetype.name || !archetype.traits) {
      console.error("Missing archetype data:", JSON.stringify(req.body));
      return res.status(400).json({
        success: false,
        message: "Missing archetype name or traits",
      });
    }

    console.log("Saving new archetype result for user:", user._id.toString());

    // Always create a new document for each quiz result
    const result = await db.collection("quiz_results").insertOne({
      userId,
      archetype: {
        name: archetype.name,
        traits: archetype.traits,
      },
      secondaryArchetypes: Array.isArray(secondaryArchetypes)
        ? secondaryArchetypes
        : [],
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
      message: "Archetype and secondary archetypes saved successfully",
      resultId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error saving archetype:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save archetype" });
  }
}
