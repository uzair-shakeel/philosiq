import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectToDatabase from "../../../../lib/mongodb";
import Icon from "../../../../models/Icon";

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

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      includeInactive = "true",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (includeInactive !== "true") {
      query.isActive = true;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { wikipediaTitle: { $regex: search, $options: "i" } },
        { occupation: { $regex: search, $options: "i" } },
      ];
    }

    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [items, total] = await Promise.all([
      Icon.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Icon.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error listing icons:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch icons" });
  }
}
