import dbConnect from '../../../../lib/mongodb/connection';
import IconAnswer from '../../../../models/IconAnswer';
import IconVote from '../../../../models/IconVote';
import Icon from '../../../../models/Icon';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    const { answerId, voteType, counterEvidence } = req.body;

    if (!answerId || !voteType) {
      return res.status(400).json({ 
        message: 'Answer ID and vote type are required' 
      });
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ 
        message: 'Vote type must be either "upvote" or "downvote"' 
      });
    }

    // We'll validate counterEvidence conditionally once we know the final nextType

    // Find the answer
    const answer = await IconAnswer.findById(answerId).populate('question');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user has already voted on this answer
    const existingVote = await IconVote.findOne({
      user: userId,
      iconAnswer: answerId,
    });

    // Determine transition: prevType -> nextType
    const prevType = existingVote ? existingVote.voteType : null;
    // If same as existing, treat as no-op to prevent toggling off
    if (prevType && prevType === voteType) {
      return res.status(200).json({
        message: 'No change',
        answer: {
          _id: answer._id,
          upvotes: answer.upvotes,
          downvotes: answer.downvotes,
          netVotes: answer.netVotes,
          isAccepted: answer.isAccepted,
        },
        currentVoteType: prevType,
      });
    }

    const nextType = voteType; // client enforces no-toggle-to-null

    // Enforce counter evidence only if final nextType is downvote, except when user has submitted an alternative answer for this question
    if (nextType === 'downvote') {
      const userHasAlternative = await IconAnswer.exists({
        icon: answer.icon,
        question: answer.question._id,
        submittedBy: userId,
        isActive: true,
        _id: { $ne: answerId },
      });

      if (!userHasAlternative) {
        const titleOk = counterEvidence && typeof counterEvidence.title === 'string' && counterEvidence.title.trim().length > 0;
        const urlOk = counterEvidence && typeof counterEvidence.url === 'string' && counterEvidence.url.trim().length > 0;
        if (!titleOk || !urlOk) {
          return res.status(400).json({ message: 'Counter evidence (title and url) is required for downvotes unless you have submitted an alternative answer for this question' });
        }
      }
    }

    // Apply counts: decrement previous, increment next
    if (prevType === 'upvote') answer.upvotes = Math.max(0, (answer.upvotes || 0) - 1);
    if (prevType === 'downvote') answer.downvotes = Math.max(0, (answer.downvotes || 0) - 1);
    if (nextType === 'upvote') answer.upvotes = (answer.upvotes || 0) + 1;
    if (nextType === 'downvote') answer.downvotes = (answer.downvotes || 0) + 1;

    // Persist vote doc
    if (existingVote) {
      existingVote.voteType = nextType;
      if (nextType === 'downvote' && counterEvidence) {
        existingVote.counterEvidence = {
          title: counterEvidence.title.trim(),
          url: counterEvidence.url.trim(),
          description: (counterEvidence.description || '').trim(),
        };
      } else {
        existingVote.counterEvidence = undefined;
      }
      await existingVote.save();
    } else {
      const newVote = new IconVote({
        user: userId,
        iconAnswer: answerId,
        voteType: nextType,
        counterEvidence: (nextType === 'downvote' && counterEvidence) ? {
          title: counterEvidence.title.trim(),
          url: counterEvidence.url.trim(),
          description: (counterEvidence.description || '').trim(),
        } : undefined,
        icon: answer.icon,
        question: answer.question._id,
      });
      await newVote.save();
    }

    // Recompute net and persist
    answer.netVotes = (answer.upvotes || 0) - (answer.downvotes || 0);
    await answer.save();

    // Check if this answer should become the accepted answer
    await checkAndUpdateAcceptedAnswer(answer.icon, answer.question._id);

    const message = prevType ? 'Vote updated' : 'Vote recorded';

    return res.status(200).json({
      message,
      currentVoteType: nextType,
      answer: {
        _id: answer._id,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
        netVotes: answer.netVotes,
        isAccepted: answer.isAccepted,
      },
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to check if the accepted answer should change based on votes
async function checkAndUpdateAcceptedAnswer(iconId, questionId) {
  try {
    // Get all answers for this icon/question combination
    const answers = await IconAnswer.find({
      icon: iconId,
      question: questionId,
      isActive: true,
    }).sort({ netVotes: -1, createdAt: 1 }); // Sort by votes desc, then by creation time asc

    if (answers.length === 0) return;

    // The answer with the highest net votes should be accepted
    const topAnswer = answers[0];
    const currentAccepted = answers.find(a => a.isAccepted);

    // If the top answer is not the currently accepted one, update
    if (!currentAccepted || currentAccepted._id.toString() !== topAnswer._id.toString()) {
      // Remove accepted status from all answers
      await IconAnswer.updateMany(
        { icon: iconId, question: questionId },
        { isAccepted: false }
      );

      // Set the top answer as accepted
      await IconAnswer.findByIdAndUpdate(topAnswer._id, { isAccepted: true });

      // Recalculate icon scores since the accepted answer changed
      await updateIconScores(iconId);
    }
  } catch (error) {
    console.error('Error updating accepted answer:', error);
  }
}

// Helper function to recalculate icon scores (same as in answers/index.js)
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
        
        if (answer.question.direction === 'Right') {
          scoreContribution *= -1;
        }
        
        scores[axisKey] += scoreContribution;
        axisCounts[axisKey]++;
      }
    }
    
    for (const axis in scores) {
      if (axisCounts[axis] > 0) {
        scores[axis] = Math.round((scores[axis] / axisCounts[axis]) * 20);
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
