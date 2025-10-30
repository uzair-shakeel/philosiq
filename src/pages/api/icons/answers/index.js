import dbConnect from '../../../../lib/mongodb/connection';
import IconAnswer from '../../../../models/IconAnswer';
import Icon from '../../../../models/Icon';
import Question from '../../../../models/Question';
// Always execute model modules to register schemas (prevents serverless tree-shake issues)
import '../../../../models/Icon';
import '../../../../models/Question';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req, res) {
  try {
    const { iconId, questionId, includeAlternatives = false } = req.query;
    
    let query = { isActive: true };
    
    if (iconId) {
      query.icon = iconId;
    }
    
    if (questionId) {
      query.question = questionId;
    }
    
    // If we want alternatives, get all answers, otherwise just accepted ones
    if (includeAlternatives !== 'true') {
      query.isAccepted = true;
    }
    
    const answers = await IconAnswer.find(query)
      .populate('question')
      .sort({ netVotes: -1, createdAt: -1 })
      .lean();
    
    return res.status(200).json({ answers });
  } catch (error) {
    console.error('Error fetching icon answers:', error);
    return res.status(500).json({ message: 'Internal server error' });
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
      iconId,
      questionId,
      answer,
      sources = [],
      reasoning,
    } = req.body;
    
    // Validate required fields
    if (!iconId || !questionId || !answer) {
      return res.status(400).json({ 
        message: 'Icon ID, Question ID, and answer are required' 
      });
    }
    
    // Verify icon and question exist
    const [icon, question] = await Promise.all([
      Icon.findById(iconId),
      Question.findById(questionId),
    ]);
    
    if (!icon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Convert answer to numerical value
    const answerValues = {
      'Strongly Agree': 2,
      'Agree': 1,
      'Neutral': 0,
      'Disagree': -1,
      'Strongly Disagree': -2,
    };
    
    const answerValue = answerValues[answer];
    if (answerValue === undefined) {
      return res.status(400).json({ message: 'Invalid answer value' });
    }
    
    // Check if there's already an accepted answer for this icon/question
    const existingAcceptedAnswer = await IconAnswer.findOne({
      icon: iconId,
      question: questionId,
      isAccepted: true,
      isActive: true,
    });
    
    // Create new answer
    const iconAnswer = new IconAnswer({
      icon: iconId,
      question: questionId,
      answer,
      answerValue,
      sources,
      reasoning,
      submittedBy: userId,
      isAccepted: !existingAcceptedAnswer, // First answer becomes accepted
    });
    
    await iconAnswer.save();
    await iconAnswer.populate([{ path: 'question' }]);
    
    // If this is the first answer, update icon scores
    if (!existingAcceptedAnswer) {
      await updateIconScores(iconId);
    }
    
    return res.status(201).json({
      message: 'Answer submitted successfully',
      answer: iconAnswer,
    });
  } catch (error) {
    console.error('Error creating icon answer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to recalculate icon scores based on accepted answers
async function updateIconScores(iconId) {
  try {
    const acceptedAnswers = await IconAnswer.find({
      icon: iconId,
      isAccepted: true,
      isActive: true,
    }).populate('question');
    
    const scores = {
      equityVsFreeMarket: 0,
      libertarianVsAuthoritarian: 0,
      progressiveVsConservative: 0,
      secularVsReligious: 0,
      globalismVsNationalism: 0,
    };
    
    const axisCounts = {
      equityVsFreeMarket: 0,
      libertarianVsAuthoritarian: 0,
      progressiveVsConservative: 0,
      secularVsReligious: 0,
      globalismVsNationalism: 0,
    };
    
    // Map axis names to score keys
    const axisMapping = {
      'Equity vs. Free Market': 'equityVsFreeMarket',
      'Libertarian vs. Authoritarian': 'libertarianVsAuthoritarian',
      'Progressive vs. Conservative': 'progressiveVsConservative',
      'Secular vs. Religious': 'secularVsReligious',
      'Globalism vs. Nationalism': 'globalismVsNationalism',
    };
    
    for (const answer of acceptedAnswers) {
      const axisKey = axisMapping[answer.question.axis];
      if (axisKey) {
        let scoreContribution = answer.answerValue * answer.question.weight;
        
        // Adjust for question direction
        if (answer.question.direction === 'Right') {
          scoreContribution *= -1;
        }
        
        scores[axisKey] += scoreContribution;
        axisCounts[axisKey]++;
      }
    }
    
    // Calculate averages and normalize to -100 to 100 scale
    for (const axis in scores) {
      if (axisCounts[axis] > 0) {
        scores[axis] = Math.round((scores[axis] / axisCounts[axis]) * 20); // Scale to -100 to 100
      }
    }
    
    const totalAnswers = acceptedAnswers.length;
    
    await Icon.findByIdAndUpdate(iconId, {
      scores,
      totalAnswers,
    });
  } catch (error) {
    console.error('Error updating icon scores:', error);
  }
}
