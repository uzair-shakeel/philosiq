import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Get user session for authentication
  const session = await getServerSession(req, res, authOptions);

  // Check if user is authenticated
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  // Connect to the database
  await connectToDatabase();
  const questionsCollection = mongoose.connection.db.collection("questions");

  // Get the question ID from the URL
  const questionId = req.query.id;

  // Validate question ID
  if (!questionId || !ObjectId.isValid(questionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid question ID" });
  }

  // GET request - retrieve a single question by ID
  if (req.method === "GET") {
    try {
      const question = await questionsCollection.findOne({
        _id: new ObjectId(questionId),
      });

      if (!question) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }

      // If user is not an admin and the question is not active, deny access
      if (session.user.role !== "admin" && !question.active) {
        return res.status(403).json({
          success: false,
          message: "Access to this question is restricted",
        });
      }

      return res.status(200).json({ success: true, question });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving question",
        error: error.message,
      });
    }
  }

  // PUT request - update an existing question
  if (req.method === "PUT") {
    // Only admins can update questions
    if (session.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update questions" });
    }

    try {
      const { question, axis, topic, direction, active } = req.body;

      // Validate required fields
      if (!question || !axis || !topic || !direction) {
        return res
          .status(400)
          .json({ success: false, message: "Required fields are missing" });
      }

      // Prepare update data
      const updateData = {
        question,
        axis,
        topic,
        direction,
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      };

      // Update the question in the database
      const result = await questionsCollection.updateOne(
        { _id: new ObjectId(questionId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Question updated successfully",
        id: questionId,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating question",
        error: error.message,
      });
    }
  }

  // DELETE request - delete a question
  if (req.method === "DELETE") {
    // Only admins can delete questions
    if (session.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete questions" });
    }

    try {
      const result = await questionsCollection.deleteOne({
        _id: new ObjectId(questionId),
      });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting question",
        error: error.message,
      });
    }
  }

  // For any other HTTP method
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
