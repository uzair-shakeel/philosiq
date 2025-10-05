// This is a temporary endpoint to help debug Stripe configuration
// Remove this in production

export default function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const config = {
    nodeEnv: process.env.NODE_ENV,
    stripeTestKey: process.env.STRIPE_SECRET_KEY ? '***' + process.env.STRIPE_SECRET_KEY.slice(-4) : 'Not set',
    stripeLiveKey: process.env.STRIPE_SECRET_KEY ? '***' + process.env.STRIPE_SECRET_KEY.slice(-4) : 'Not set',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Not set',
  };

  res.status(200).json({
    message: 'Stripe Configuration Check',
    config,
    instructions: 'To fix the Stripe test mode issue, add this to your .env.local file:',
    exampleEnv: `# .env.local
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000`
  });
}
