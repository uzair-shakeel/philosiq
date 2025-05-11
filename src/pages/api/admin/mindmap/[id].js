import connectToDatabase from "../../../../lib/mongodb/index";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  console.log("Delete MindMap entry handler called");

  // Check if user is authenticated
  const session = await getSession({ req });
  console.log("Session status:", session ? "Found" : "Not found");

  if (!session) {
    console.log("Authentication failed: No session found");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Please log in" });
  }

  // For development, we'll assume all authenticated users can access the admin panel
  if (!session.user) {
    console.log("Authentication failed: No user in session");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid session" });
  }

  const { id } = req.query;
  console.log("Attempting to delete entry with ID:", id);

  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      console.log("Invalid ID format:", id);
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    console.log("Deleting entry...");
    // Delete the entry
    const result = await mindmapCollection.deleteOne({
      _id: new ObjectId(id),
    });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      console.log("Entry not found for deletion");
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    console.log("Entry deleted successfully");
    return res.status(200).json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting mindmap entry:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to delete entry",
      error: error.message,
    });
  }
}
