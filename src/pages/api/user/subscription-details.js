import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email required" });

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate subscription periods based on member since date
    let currentPeriodStart = null;
    let currentPeriodEnd = null;

    if (user.philosiqPlusSince) {
      const memberSince = new Date(user.philosiqPlusSince);
      const now = new Date();

      // Calculate how many 3-month periods have passed since member since
      const monthsDiff =
        (now.getFullYear() - memberSince.getFullYear()) * 12 +
        (now.getMonth() - memberSince.getMonth());
      const periodsPassed = Math.floor(monthsDiff / 3);

      // Current period starts at the beginning of the current 3-month period
      currentPeriodStart = new Date(memberSince);
      currentPeriodStart.setMonth(memberSince.getMonth() + periodsPassed * 3);

      // Current period ends exactly 3 months after start
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setMonth(currentPeriodStart.getMonth() + 3);
    }

    const subscriptionDetails = {
      active: !!user.philosiqPlusActive,
      since: user.philosiqPlusSince || null,
      currentPeriodStart: currentPeriodStart,
      currentPeriodEnd: currentPeriodEnd,
    };

    res.status(200).json(subscriptionDetails);
  } catch (e) {
    console.error("subscription-details error", e);
    res.status(500).json({ error: "Failed to fetch subscription details" });
  }
}
