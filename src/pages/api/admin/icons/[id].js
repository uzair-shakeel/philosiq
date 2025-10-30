import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectToDatabase from "../../../../lib/mongodb";
import Icon from "../../../../models/Icon";
import IconAnswer from "../../../../models/IconAnswer";
import IconVote from "../../../../models/IconVote";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error("MongoDB connection error:", dbError);
    return res.status(500).json({ success: false, message: "Database connection error." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { isActive } = req.body || {};
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ success: false, message: "isActive boolean is required" });
      }
      const icon = await Icon.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
      if (!icon) {
        return res.status(404).json({ success: false, message: "Icon not found" });
      }
      if (isActive === false) {
        await IconAnswer.updateMany({ icon: id }, { isActive: false });
      }
      return res.status(200).json({ success: true, icon });
    } catch (error) {
      console.error("Error updating icon active state:", error);
      return res.status(500).json({ success: false, message: "Failed to update icon" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const icon = await Icon.findById(id);
      if (!icon) {
        return res.status(404).json({ success: false, message: "Icon not found" });
      }

      const hard = (req.query.hard || "false").toString() === "true";

      if (hard) {
        // Permanently remove icon and related data
        await IconAnswer.deleteMany({ icon: id });
        await IconVote.deleteMany({ icon: id });
        await Icon.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Icon permanently deleted" });
      } else {
        // Soft delete: deactivate icon and its answers
        await Icon.findByIdAndUpdate(id, { isActive: false });
        await IconAnswer.updateMany({ icon: id }, { isActive: false });
        return res.status(200).json({ success: true, message: "Icon deactivated" });
      }
    } catch (error) {
      console.error("Error deleting icon:", error);
      return res.status(500).json({ success: false, message: "Failed to delete icon" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
