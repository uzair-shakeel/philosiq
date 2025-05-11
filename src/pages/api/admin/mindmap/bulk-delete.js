import { getSession } from "next-auth/react";
import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }

    // Connect to database
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get IDs from request body
    const { ids } = req.body;

    // Validate IDs array
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: ids must be a non-empty array",
      });
    }

    try {
      // Convert string IDs to ObjectIds
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

      // Delete entries
      const result = await mindmapCollection.deleteMany({
        _id: { $in: objectIds },
      });

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} entries`,
        deletedCount: result.deletedCount,
      });
    } catch (dbError) {
      console.error("Database error during bulk delete:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to delete entries",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error in bulk delete API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
