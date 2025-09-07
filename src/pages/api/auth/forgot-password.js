import crypto from "crypto";
import { connectToDatabase } from "../../../utils/db";
import { sendPasswordResetEmail } from "../../../utils/email";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    // Always return 200 to avoid user enumeration, but only issue token if user exists
    if (!user)
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link was sent" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.collection("password_resets").updateOne(
      { email },
      {
        $set: { token, email, expiresAt, used: false, createdAt: new Date() },
      },
      { upsert: true }
    );

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://philosiq-testing.vercel.app";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);

    return res
      .status(200)
      .json({ message: "If the email exists, a reset link was sent" });
  } catch (e) {
    console.error("forgot-password error", e);
    return res.status(500).json({ message: "Failed to process request" });
  }
}
