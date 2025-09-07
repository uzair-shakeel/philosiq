import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { token, password } = req.body || {};
    if (!token || !password)
      return res.status(400).json({ message: "Token and password required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const { db } = await connectToDatabase();
    const entry = await db.collection("password_resets").findOne({ token });
    if (!entry || entry.used)
      return res.status(400).json({ message: "Invalid or used token" });
    if (new Date(entry.expiresAt) < new Date())
      return res.status(400).json({ message: "Token expired" });

    const hashed = await bcrypt.hash(password, 10);
    await db
      .collection("users")
      .updateOne({ email: entry.email }, { $set: { password: hashed } });
    await db
      .collection("password_resets")
      .updateOne({ token }, { $set: { used: true, usedAt: new Date() } });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("reset-password error", e);
    return res.status(500).json({ message: "Failed to reset password" });
  }
}
