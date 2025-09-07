import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { db } = await connectToDatabase();

    // Update user to activate Philosiq+
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          philosiqPlusActive: true,
          philosiqPlusSince: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (result.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: "User already has active subscription" });
    }

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      user: email,
    });
  } catch (error) {
    console.error("Error activating subscription:", error);
    res.status(500).json({ error: "Failed to activate subscription" });
  }
}
