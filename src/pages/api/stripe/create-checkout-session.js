import Stripe from "stripe";
import { connectToDatabase } from "../../../utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, email, priceId, successUrl, cancelUrl } = req.body || {};

    if (!process.env.STRIPE_SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Stripe not configured (missing STRIPE_SECRET_KEY)" });
    }

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const { db } = await connectToDatabase();

    // Fetch or create Stripe customer mapped to this user
    const existing = await db.collection("users").findOne({ email });
    if (!existing) {
      return res.status(401).json({ error: "User not found" });
    }

    let customerId = existing.stripeCustomerId;
    // Ensure we have a valid customer in this Stripe mode (test/live)
    const ensureCustomer = async () => {
      if (!customerId) return false;
      try {
        await stripe.customers.retrieve(customerId);
        return true;
      } catch (e) {
        if (e?.raw?.code === "resource_missing" || e?.statusCode === 404) {
          return false;
        }
        throw e;
      }
    };

    let validCustomer = await ensureCustomer();
    if (!validCustomer) {
      try {
        const customer = await stripe.customers.create({
          email,
          metadata: { userId: existing._id.toString() },
        });
        customerId = customer.id;
        await db
          .collection("users")
          .updateOne(
            { _id: existing._id },
            { $set: { stripeCustomerId: customerId } }
          );
      } catch (e) {
        console.error("Stripe customer create error", e);
        return res
          .status(500)
          .json({ error: `Stripe customer error: ${e?.message || "unknown"}` });
      }
    }

    // Prefer provided priceId, else STRIPE_PRICE_ID, then STRIPE_QUARTERLY_PRICE_ID, then STRIPE_YEARLY_PRICE_ID
    const configuredPriceId =
      priceId ||
      process.env.STRIPE_PRICE_ID ||
      process.env.STRIPE_QUARTERLY_PRICE_ID ||
      process.env.STRIPE_YEARLY_PRICE_ID;

    let isRecurring = true; // default to subscription for our use case
    let lineItems;

    if (configuredPriceId) {
      // Validate price exists and is active; choose mode by whether it's recurring
      try {
        const price = await stripe.prices.retrieve(configuredPriceId);
        if (!price?.active) {
          return res
            .status(400)
            .json({ error: `Stripe price ${configuredPriceId} is not active` });
        }
        isRecurring = !!price?.recurring;
        lineItems = [
          {
            price: configuredPriceId,
            quantity: 1,
          },
        ];
      } catch (e) {
        console.error("Stripe price retrieve error", e);
        return res
          .status(400)
          .json({ error: `Invalid STRIPE_PRICE_ID: ${configuredPriceId}` });
      }
    } else {
      // No price configured: create dynamic quarterly $4.99 subscription via price_data
      isRecurring = true;
      const currency = process.env.NEXT_PUBLIC_STRIPE_CURRENCY || "usd";
      const unitAmount = 499; // $4.99
      lineItems = [
        {
          price_data: {
            currency,
            product_data: {
              name: "Philosiq+ Quarterly",
            },
            unit_amount: unitAmount,
            recurring: { interval: "month", interval_count: 3 },
          },
          quantity: 1,
        },
      ];
    }

    console.log("Creating checkout session for", {
      email,
      customerId,
      configuredPriceId,
    });
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer: customerId,
      client_reference_id: existing._id.toString(),
      line_items: lineItems,
      success_url:
        successUrl ||
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/results?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/results?upgrade=cancel`,
      metadata: {
        userId: existing._id.toString(),
        email,
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    const msg =
      err?.raw?.message || err?.message || "Failed to create checkout session";
    return res.status(500).json({ error: msg });
  }
}
