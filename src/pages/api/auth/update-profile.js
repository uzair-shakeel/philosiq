import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get auth token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify JWT token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to database
    const { db } = await connectToDatabase();

    // Get user from database
    const userId = decoded.userId;
    const filter =
      typeof userId === "string"
        ? { _id: new ObjectId(userId) }
        : { _id: userId };
    const user = await db.collection("users").findOne(filter);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { name, email, currentPassword, newPassword } = req.body;

    // Prepare update object
    const updateData = {};

    // Update name if provided
    if (name && name !== user.name) {
      updateData.name = name;
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already taken by another user
      const existingUser = await db.collection("users").findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      updateData.password = hashedPassword;
    }

    // If no updates, return success
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes to update",
      });
    }

    // Update user in database
    const result = await db
      .collection("users")
      .updateOne(filter, { $set: updateData });

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to update profile" });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Failed to update profile" });
  }
}
