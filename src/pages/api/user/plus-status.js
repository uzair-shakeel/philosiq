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
    // Derive current period end (3-month periods from since)
    let currentPeriodEnd = null;
    if (user?.philosiqPlusSince) {
      const memberSince = new Date(user.philosiqPlusSince);
      const now = new Date();
      const monthsDiff =
        (now.getFullYear() - memberSince.getFullYear()) * 12 +
        (now.getMonth() - memberSince.getMonth());
      const periodsPassed = Math.floor(monthsDiff / 3);
      const currentPeriodStart = new Date(memberSince);
      currentPeriodStart.setMonth(memberSince.getMonth() + periodsPassed * 3);
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setMonth(currentPeriodStart.getMonth() + 3);
    }

    const cancelAtPeriodEnd = !!user?.philosiqPlusCancelAtPeriodEnd;
    let activeEffective = !!user?.philosiqPlusActive;
    if (cancelAtPeriodEnd && currentPeriodEnd && new Date() > currentPeriodEnd) {
      activeEffective = false;
    }

    return res.status(200).json({
      active: activeEffective,
      since: user?.philosiqPlusSince || null,
      cancelAtPeriodEnd,
      currentPeriodEnd,
    });
  } catch (e) {
    console.error("plus-status error", e);
    res.status(500).json({ error: "failed" });
  }
}
