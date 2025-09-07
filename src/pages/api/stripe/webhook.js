import Stripe from "stripe";
import { buffer } from "micro";
import { connectToDatabase } from "../../../utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const { db } = await connectToDatabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        const email =
          session.customer_details?.email || session.metadata?.email;
        const userId = session.metadata?.userId;

        if (email) {
          await db.collection("users").updateOne(
            { email },
            {
              $set: {
                stripeCustomerId: customerId,
                philosiqPlusActive: true,
                philosiqPlusSince: new Date(),
              },
            }
          );
        }
        break;
      }
      case "payment_intent.succeeded": {
        // For one-time payments, also grant Philosiq+
        const pi = event.data.object;
        // Retrieve customer to get email
        if (pi.customer) {
          try {
            const customer = await stripe.customers.retrieve(pi.customer);
            const email = customer?.email;
            if (email) {
              await db.collection("users").updateOne(
                { email },
                {
                  $set: {
                    stripeCustomerId:
                      typeof pi.customer === "string"
                        ? pi.customer
                        : customer.id,
                    philosiqPlusActive: true,
                    philosiqPlusSince: new Date(),
                  },
                }
              );
            }
          } catch (e) {
            console.error("Failed to resolve customer for PI", e);
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        await db
          .collection("users")
          .updateOne(
            { stripeCustomerId: customerId },
            { $set: { philosiqPlusActive: false } }
          );
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
