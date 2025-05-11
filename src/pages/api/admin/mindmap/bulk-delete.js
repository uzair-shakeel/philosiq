import connectToDatabase from "../../../../lib/mongodb/index";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  console.log("Bulk delete MindMap entries handler called");

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

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { ids } = req.body;
    console.log("Attempting to delete entries with IDs:", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.log("Invalid request: empty or invalid ids array");
      return res.status(400).json({
        success: false,
        message: "Invalid request: ids must be a non-empty array",
      });
    }

    console.log("Connecting to database...");
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Validate all IDs
    const validIds = ids.filter((id) => ObjectId.isValid(id));
    if (validIds.length !== ids.length) {
      console.log(
        "Invalid IDs found:",
        ids.filter((id) => !ObjectId.isValid(id))
      );
      return res.status(400).json({
        success: false,
        message: "One or more invalid IDs provided",
      });
    }

    // Convert string IDs to ObjectIds
    const objectIds = validIds.map((id) => new ObjectId(id));
    console.log("Deleting entries...");

    // Delete all entries
    const result = await mindmapCollection.deleteMany({
      _id: { $in: objectIds },
    });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      console.log("No entries found for deletion");
      return res.status(404).json({
        success: false,
        message: "No entries found to delete",
      });
    }

    console.log(`Successfully deleted ${result.deletedCount} entries`);
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} entries`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting mindmap entries:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to delete entries",
      error: error.message,
    });
  }
}
