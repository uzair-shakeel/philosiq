import Stripe from "stripe";
import { connectToDatabase } from "../../../utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, returnUrl } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    if (!user?.stripeCustomerId) {
      return res.status(404).json({ error: "No Stripe customer" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url:
        returnUrl ||
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/results`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Portal error", err);
    res.status(500).json({ error: "Failed to create portal session" });
  }
}
