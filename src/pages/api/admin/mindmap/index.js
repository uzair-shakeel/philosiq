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

    // Handle GET request
    if (req.method === "GET") {
      // Get pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter query
      const filter = {};
      const { education, gender, race, age, votingTendency, archetype } =
        req.query;

      if (education) filter["demographics.education"] = education;
      if (gender) filter["demographics.gender"] = gender;
      if (race) filter["demographics.race"] = race;
      if (age) filter["demographics.age"] = age;
      if (votingTendency)
        filter["demographics.votingTendency"] = votingTendency;
      if (archetype) filter.archetype = archetype;

      // Get total count for pagination
      const total = await mindmapCollection.countDocuments(filter);

      // Get paginated entries
      const entries = await mindmapCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return res.status(200).json({
        success: true,
        entries,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Error in mindmap API:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
