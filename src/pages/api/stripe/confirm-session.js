import Stripe from "stripe";
import { connectToDatabase } from "../../../utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const { session_id } = req.query;
  if (!session_id)
    return res.status(400).json({ error: "session_id required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const email = session.customer_details?.email || session.metadata?.email;
    const customerId = session.customer;

    if (!email) {
      return res.status(400).json({ error: "No email on session" });
    }

    const { db } = await connectToDatabase();
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          stripeCustomerId:
            typeof customerId === "string" ? customerId : undefined,
          philosiqPlusActive: true,
          philosiqPlusSince: new Date(),
        },
      }
    );

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("confirm-session error", e);
    return res.status(500).json({ error: e?.message || "failed" });
  }
}
