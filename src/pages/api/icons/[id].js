import dbConnect from '../../../lib/mongodb/connection';
import Icon from '../../../models/Icon';
import IconAnswer from '../../../models/IconAnswer';
import Question from '../../../models/Question';
// eslint-disable-next-line no-unused-vars
const __ensureModelsRegistered = [Icon?.modelName, Question?.modelName];
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, id);
    case 'PUT':
      return handlePut(req, res, id);
    case 'DELETE':
      return handleDelete(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req, res, id) {
  try {
    const { includeAnswers = false } = req.query;
    
    const icon = await Icon.findById(id)
      .lean();
    
    if (!icon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    
    let answers = [];
    if (includeAnswers === 'true') {
      answers = await IconAnswer.find({ 
        icon: id, 
        isActive: true,
        isAccepted: true 
      })
        .populate('question')
        .sort({ 'question.axis': 1 })
        .lean();
    }
    
    return res.status(200).json({
      icon,
      answers,
    });
  } catch (error) {
    console.error('Error fetching icon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePut(req, res, id) {
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
    
    const icon = await Icon.findById(id);
    
    if (!icon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    
    // Only allow creator to update (we don't have admin role check in this auth system)
    if (icon.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this icon' });
    }
    
    const allowedUpdates = [
      'name', 'description', 'occupation', 'birthDate', 'deathDate', 'nationality', 'isActive'
    ];
    
    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    const updatedIcon = await Icon.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      message: 'Icon updated successfully',
      icon: updatedIcon,
    });
  } catch (error) {
    console.error('Error updating icon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDelete(req, res, id) {
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
    
    const icon = await Icon.findById(id);
    
    if (!icon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    
    // Only allow creator to delete
    if (icon.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this icon' });
    }
    
    // Soft delete by setting isActive to false
    await Icon.findByIdAndUpdate(id, { isActive: false });
    
    // Also deactivate all answers for this icon
    await IconAnswer.updateMany(
      { icon: id },
      { isActive: false }
    );
    
    return res.status(200).json({
      message: 'Icon deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting icon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
