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

  // GET - List all admins
  if (req.method === "GET") {
    try {
      // Find all users with role "admin"
      const admins = await User.find({ role: "admin" }).select("-password");

      return res.status(200).json({
        success: true,
        admins: admins,
      });
    } catch (error) {
      console.error("Error fetching admins:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admins",
      });
    }
  }

  // POST - Create a new admin
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin user
      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      await newAdmin.save();

      // Return success without password
      return res.status(201).json({
        success: true,
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create admin",
      });
    }
  }

  // DELETE - Delete an admin
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      // Validate ID
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Admin ID is required",
        });
      }

      // Prevent deleting yourself
      if (id === session.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      // Find and delete the admin
      const deletedAdmin = await User.findOneAndDelete({
        _id: id,
        role: "admin",
      });

      if (!deletedAdmin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete admin",
      });
    }
  }

  // Method not allowed
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
