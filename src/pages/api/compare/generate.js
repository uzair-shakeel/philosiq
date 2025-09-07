import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { resultId } = req.body || {};
    if (!resultId || !ObjectId.isValid(resultId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid resultId" });
    }

    const { db } = await connectToDatabase();
    const userId = new ObjectId(decoded.userId);

    // Ensure result belongs to user
    const result = await db
      .collection("quiz_results")
      .findOne({ _id: new ObjectId(resultId), userId });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Result not found" });
    }

    // Generate a short URL-safe code (IQrypt Code)
    const code = crypto.randomBytes(8).toString("base64url"); // ~11 chars

    await db.collection("compare_codes").insertOne({
      code,
      resultId: result._id,
      userId,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, code });
  } catch (error) {
    console.error("Error generating compare code:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate code" });
  }
}







