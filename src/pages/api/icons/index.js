import dbConnect from "../../../lib/mongodb/connection";
import Icon from "../../../models/Icon";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGet(req, res) {
  try {
    const {
      search,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { isActive: true };

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const icons = await Icon.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Icon.countDocuments(query);

    return res.status(200).json({
      icons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching icons:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePost(req, res) {
  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify JWT token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const {
      name,
      wikipediaTitle,
      wikipediaPageId,
      description,
      imageUrl,
      occupation,
      birthDate,
      deathDate,
      nationality,
      characterType,
      isFictional,
      sourceMedia,
    } = req.body;

    // Check if icon already exists
    const existingIcon = await Icon.findOne({
      $or: [{ wikipediaPageId }, { wikipediaTitle }],
    });

    if (existingIcon) {
      return res.status(400).json({
        message: "An icon for this person already exists",
        existingIcon: existingIcon._id,
      });
    }

    const icon = new Icon({
      name,
      wikipediaTitle,
      wikipediaPageId,
      description,
      imageUrl,
      occupation,
      birthDate,
      deathDate,
      nationality,
      characterType: characterType || "real",
      isFictional: isFictional || false,
      sourceMedia,
      createdBy: userId,
    });

    await icon.save();

    return res.status(201).json({
      message: "Icon created successfully",
      icon,
    });
  } catch (error) {
    console.error("Error creating icon:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "An icon for this person already exists",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
