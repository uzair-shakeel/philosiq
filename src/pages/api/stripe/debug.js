import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    const info = {
      hasSecret: !!process.env.STRIPE_SECRET_KEY,
      hasPriceId: !!process.env.STRIPE_PRICE_ID,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || null,
      priceCheck: null,
    };

    if (!process.env.STRIPE_SECRET_KEY) {
      return res
        .status(500)
        .json({ ok: false, ...info, error: "Missing STRIPE_SECRET_KEY" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (process.env.STRIPE_PRICE_ID) {
      try {
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);
        info.priceCheck = {
          id: price.id,
          active: price.active,
          currency: price.currency,
          recurring: !!price.recurring,
          product:
            typeof price.product === "string"
              ? price.product
              : price.product?.id,
          livemode: !!price.livemode,
        };
      } catch (e) {
        return res
          .status(400)
          .json({
            ok: false,
            ...info,
            error: `Price retrieve failed: ${e?.message}`,
          });
      }
    }

    return res.status(200).json({ ok: true, ...info });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "unknown" });
  }
}
