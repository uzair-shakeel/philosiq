import Stripe from "stripe";
import { connectToDatabase } from "../../../utils/db";

// Initialize Stripe with test mode for development
let stripe;
try {
  // Force test mode for development
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  
  console.log("Initializing Stripe in TEST mode");
  
  stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
  });
  
} catch (err) {
  console.error("Stripe initialization error:", err);
  throw new Error("Failed to initialize Stripe in test mode. Please set STRIPE_TEST_SECRET_KEY.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { email, returnUrl } = req.body || {};
    
    // Validate email
    if (!email) {
      console.error("No email provided in request");
      return res.status(400).json({ 
        error: "Email is required",
        details: "No email was provided in the request body"
      });
    }

    // Connect to database
    let db;
    try {
      const dbConnection = await connectToDatabase();
      db = dbConnection.db;
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ 
        error: "Database connection failed",
        details: dbError.message 
      });
    }

    // Find user in database
    let user;
    try {
      user = await db.collection("users").findOne({ email });
      console.log("User found:", user ? "Yes" : "No");
      if (user) {
        console.log("User has stripeCustomerId:", !!user.stripeCustomerId);
      }
    } catch (findError) {
      console.error("Error finding user:", findError);
      return res.status(500).json({ 
        error: "Database query failed",
        details: findError.message 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        error: "User not found",
        details: `No user found with email: ${email}`
      });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ 
        error: "No subscription found",
        details: "This account doesn't have an associated Stripe customer ID"
      });
    }

    // Create Stripe portal session
    try {
      console.log("Creating Stripe portal session for customer:", user.stripeCustomerId);
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl || 
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/profile`
      });
      
      console.log("Stripe portal session created successfully");
      return res.status(200).json({ 
        url: session.url 
      });
      
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      return res.status(stripeError.statusCode || 500).json({
        error: "Stripe API error",
        details: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });
    }
    
  } catch (err) {
    console.error("Unexpected error in portal-session:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
