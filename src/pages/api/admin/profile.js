import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // Connect to the database
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error("MongoDB connection error:", dbError);
    return res.status(500).json({
      success: false,
      message: "Database connection error. Please try again later.",
    });
  }

  // Check if user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // PUT - Update admin profile
  if (req.method === "PUT") {
    try {
      const { name, email, currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      // Get current user
      const user = await User.findOne({ email: session.user.email }).select(
        "+password"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if trying to change password
      if (newPassword) {
        // Verify current password
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: "Current password is required to change password",
          });
        }

        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isPasswordValid) {
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
          });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user with new password
        user.password = hashedPassword;
      }

      // Update user profile
      user.name = name;

      // Check if email is being changed
      if (email !== user.email) {
        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (
          existingUser &&
          existingUser._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use",
          });
        }

        user.email = email;
      }

      // Save updates
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }

  // Method not allowed
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
