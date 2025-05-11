import { getSession } from "next-auth/react";
import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    const { id } = req.query;

    if (req.method === "DELETE") {
      const result = await mindmapCollection.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (result.deletedCount === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Entry deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Entry not found" });
      }
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Error in mindmap API:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
