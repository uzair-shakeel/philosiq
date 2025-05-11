import { getSession } from "next-auth/react";
import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Connect to database
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get the ID from the URL
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing entry ID",
      });
    }

    try {
      // Convert string ID to ObjectId
      const objectId = new mongoose.Types.ObjectId(id);

      // Delete the entry
      const result = await mindmapCollection.deleteOne({
        _id: objectId,
      });

      if (result.deletedCount === 1) {
        return res.status(200).json({
          success: true,
          message: "Entry deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Entry not found",
        });
      }
    } catch (dbError) {
      console.error("Database error during delete:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to delete entry",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error in delete API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
