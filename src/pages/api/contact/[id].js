import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Connect to the database
  await connectToDatabase();

  // Check admin authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const messageId = req.query.id;

  // Validate message ID
  if (!messageId || !ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid message ID" });
  }

  // GET - Get a single contact message
  if (req.method === "GET") {
    try {
      const message = await Contact.findById(messageId);

      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }

      // If status is unread, mark as read
      if (message.status === "unread") {
        message.status = "read";
        await message.save();
      }

      return res.status(200).json({ success: true, message });
    } catch (error) {
      console.error("Error fetching message:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch message",
        error: error.message,
      });
    }
  }

  // PUT - Update message status or add response
  if (req.method === "PUT") {
    try {
      const { status, response } = req.body;

      // Find the message
      const message = await Contact.findById(messageId);

      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }

      // Update fields
      const updateData = {};

      if (status) {
        updateData.status = status;
      }

      if (response) {
        updateData.response = response;
        updateData.status = "responded";
        updateData.respondedAt = new Date();
        updateData.respondedBy = session.user.id;
      }

      // Update the message
      const updatedMessage = await Contact.findByIdAndUpdate(
        messageId,
        { $set: updateData },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Message updated successfully",
        data: updatedMessage,
      });
    } catch (error) {
      console.error("Error updating message:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update message",
        error: error.message,
      });
    }
  }

  // DELETE - Delete a message
  if (req.method === "DELETE") {
    try {
      const result = await Contact.findByIdAndDelete(messageId);

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete message",
        error: error.message,
      });
    }
  }

  // Method not allowed
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
