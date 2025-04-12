import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check if user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Connect to the database
    await connectToDatabase();
    const questionsCollection = mongoose.connection.db.collection("questions");

    // Get all questions that don't have weight_agree or weight_disagree fields
    const questions = await questionsCollection
      .find({
        $or: [
          { weight_agree: { $exists: false } },
          { weight_disagree: { $exists: false } },
        ],
      })
      .toArray();

    console.log(`Found ${questions.length} questions that need migration`);

    // Update all questions to add weight_agree and weight_disagree based on weight
    const updatePromises = questions.map((question) => {
      const weight = question.weight || 1;
      return questionsCollection.updateOne(
        { _id: question._id },
        {
          $set: {
            weight_agree: weight,
            weight_disagree: weight,
          },
        }
      );
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);

    // Count successful updates
    const updatedCount = results.reduce(
      (count, result) => count + result.modifiedCount,
      0
    );

    return res.status(200).json({
      success: true,
      message: `Successfully migrated ${updatedCount} questions`,
      totalProcessed: questions.length,
      totalUpdated: updatedCount,
    });
  } catch (error) {
    console.error("Error during weight migration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to migrate question weights",
      error: error.message,
    });
  }
}
