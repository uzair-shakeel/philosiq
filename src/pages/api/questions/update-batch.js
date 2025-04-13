import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/**
 * API endpoint for batch updating questions
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Get user session for authentication
  const session = await getServerSession(req, res, authOptions);

  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Admin rights required.",
    });
  }

  try {
    // Connect to the database
    await connectToDatabase();
    const questionsCollection = mongoose.connection.db.collection("questions");

    // Get the batch updates from the request body
    const { updates } = req.body;

    // Debug: log the updates being requested
    console.log("Batch update request:", JSON.stringify(req.body, null, 2));

    // Validate that updates is an array
    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Updates must be an array",
      });
    }

    // Process each update
    const updateResults = await Promise.all(
      updates.map(async (updateItem) => {
        const { id, update } = updateItem;

        // Skip if no id or update is provided
        if (!id || !update) {
          return { success: false, id, error: "Missing id or update data" };
        }

        // Validate the ID
        if (!ObjectId.isValid(id)) {
          return { success: false, id, error: "Invalid question ID" };
        }

        try {
          // Update the question
          const result = await questionsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...update, updatedAt: new Date() } }
          );

          return {
            success: result.matchedCount > 0,
            id,
            updated: result.modifiedCount > 0,
          };
        } catch (error) {
          console.error(`Error updating question ${id}:`, error);
          return { success: false, id, error: error.message };
        }
      })
    );

    // Count successful updates
    const successCount = updateResults.filter((r) => r.success).length;

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${successCount} of ${updateResults.length} updates`,
      results: updateResults,
    });
  } catch (error) {
    console.error("Error in batch update:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing batch update",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
