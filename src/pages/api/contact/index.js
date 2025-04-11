import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Connect to the database
  try {
    console.log("Connecting to MongoDB database...");
    await connectToDatabase();
    console.log("MongoDB connection successful!");
  } catch (dbError) {
    console.error("MongoDB connection error:", dbError);
    return res.status(500).json({
      success: false,
      message: "Database connection error. Please try again later.",
    });
  }

  // GET - Get all contact messages (admin only)
  if (req.method === "GET") {
    // Check admin authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      // Parse query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status;

      // Build query
      let query = {};
      if (status) {
        query.status = status;
      }

      // Count total messages
      const total = await Contact.countDocuments(query);

      // Get messages with pagination
      const messages = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Calculate pagination info
      const pages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        messages,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  }

  // POST - Create a new contact message (public)
  if (req.method === "POST") {
    try {
      console.log("Received contact form POST request:", req.body);
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        console.log("Missing required fields:", {
          name,
          email,
          subject,
          message,
        });
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Create new contact message
      const newMessage = new Contact({
        name,
        email,
        subject,
        message,
        status: "unread",
      });

      console.log("Attempting to save contact message:", newMessage);
      await newMessage.save();
      console.log("Contact message saved successfully!");

      return res.status(201).json({
        success: true,
        message: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error("Error creating message:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again.",
      });
    }
  }

  // Method not allowed
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
