import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Get user session for authentication
  const session = await getServerSession(req, res, authOptions);

  // Check authentication
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Connect to the database
  await connectToDatabase();
  const questionsCollection = mongoose.connection.db.collection("questions");

  if (req.method === "GET") {
    // Get all questions
    try {
      // Parse query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build query filter
      let query = session.user.role === "admin" ? {} : { active: true };

      // Apply additional filters if provided
      if (req.query.axis) query.axis = req.query.axis;
      if (req.query.topic)
        query.topic = { $regex: req.query.topic, $options: "i" };
      if (req.query.direction) query.direction = req.query.direction;
      if (req.query.active === "true") query.active = true;
      if (req.query.active === "false") query.active = false;

      // Get total count for pagination
      const total = await questionsCollection.countDocuments(query);

      // Get questions with pagination
      const questions = await questionsCollection
        .find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Calculate pagination info
      const pages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        questions,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch questions",
      });
    }
  } else if (req.method === "POST") {
    // Only admins can create questions
    if (session.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create questions" });
    }

    try {
      const {
        question,
        axis,
        topic,
        direction,
        weight,
        weight_agree,
        weight_disagree,
        active,
      } = req.body;

      // Validate required fields
      if (!question || !axis || !topic || !direction) {
        return res
          .status(400)
          .json({ success: false, message: "Required fields are missing" });
      }

      // Prepare the new question data
      const newQuestion = {
        question,
        axis,
        topic,
        direction,
        weight: weight || 1,
        weight_agree: weight_agree || weight || 1,
        weight_disagree: weight_disagree || weight || 1,
        active: active !== undefined ? active : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert into database
      const result = await questionsCollection.insertOne(newQuestion);

      if (result.acknowledged) {
        return res.status(201).json({
          success: true,
          message: "Question created successfully",
          questionId: result.insertedId,
        });
      } else {
        throw new Error("Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create question",
      });
    }
  }

  // Method not allowed
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
