import connectToDatabase from "../../../../lib/mongodb/index";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req, res) {
  console.log("MindMap API handler called");

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

  // Temporarily remove the isAdmin check for development
  // if (!session.user.isAdmin) {
  //   console.log("Authentication failed: User is not admin");
  //   return res.status(401).json({ success: false, message: "Unauthorized - Admin access required" });
  // }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Attempting database connection...");
    await connectToDatabase();
    console.log("Database connected successfully");

    const mindmapCollection = mongoose.connection.db.collection("mindmapData");
    console.log("Accessing mindmapData collection");

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
    if (votingTendency) filter["demographics.votingTendency"] = votingTendency;
    if (archetype) filter.archetype = archetype;

    console.log("Applying filter:", filter);

    // Get total count for pagination
    const total = await mindmapCollection.countDocuments(filter);
    console.log("Total documents found:", total);

    // Get paginated entries
    const entries = await mindmapCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log("Retrieved entries count:", entries.length);

    return res.status(200).json({
      success: true,
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in admin mindmap API:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch MindMap entries",
      error: error.message,
    });
  }
}
