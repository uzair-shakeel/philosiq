import { getSession } from "next-auth/react";
import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }

    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or empty IDs array" });
    }

    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    const result = await mindmapCollection.deleteMany({
      _id: { $in: objectIds },
    });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} entries`,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No entries found to delete" });
    }
  } catch (error) {
    console.error("Error in bulk delete API:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
