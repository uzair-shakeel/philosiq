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
    return res.status(200).json({
      active: !!user?.philosiqPlusActive,
      since: user?.philosiqPlusSince || null,
    });
  } catch (e) {
    console.error("plus-status error", e);
    res.status(500).json({ error: "failed" });
  }
}
