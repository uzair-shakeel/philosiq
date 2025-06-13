import React, { useEffect, useState } from "react";

/**
 * Component to display a visual representation of a political axis
 * with the user's position marked
 */
export default function AxisGraph({
  name,
  score = 50,
  rawScore = 0, // This is the -100 to 100 score
  leftLabel,
  updatePercents,
  rightLabel,
  key,
  questions,
  answers,
  positionStrength,
  userPosition,
  className = "",
  onLetterDetermined, // New callback for returning the axis letter
  onAxisDataUpdate, // New callback for returning axis breakdown data
}) {
  // Return early if there's no data
  if (!questions || !answers || questions.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        No question or answer data available for debugging
      </div>
    );
  }

  // Create axis aliases to handle alternative names
  const axisAliases = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Handle the canonical name for axes with aliases
  const canonicalName =
    name === "Equality vs. Markets" ? "Equity vs. Free Market" : name;

  // Calculate the base value of the answer
  const getBaseValue = (answerValue) => {
    const baseValues = {
      "-2": -1,
      "-1": -0.5,
      0: 0,
      1: 0.5,
      2: 1,
    };
    return baseValues[answerValue?.toString()] || 0;
  };

  // Calculate the weighted score for a single answer
  const calculateQuestionScore = (question, answerValue) => {
    if (answerValue === undefined) return "Not answered";

    const baseValue = getBaseValue(answerValue);
    if (baseValue === 0) return "0 (Neutral)";

    // Determine which weight to apply
    let appliedWeight;
    if (baseValue > 0) {
      // For positive answers (agree/strongly agree), use agree weight
      appliedWeight = question.weight_agree || question.weight || 1;
    } else {
      // For negative answers (disagree/strongly disagree), use disagree weight
      appliedWeight = question.weight_disagree || question.weight || 1;
    }

    // Calculate the weighted score
    let weightedScore = baseValue * appliedWeight;

    // If the question is aligned with the "Left" side, multiply by -1
    // This is because Left should be negative and Right should be positive
    if (question.direction === "Left") {
      weightedScore *= -1;
    }

    return weightedScore;
  };

  // Group questions by axis
  const questionsByAxis = {};
  questions.forEach((question) => {
    // Use canonical axis name (through alias mapping if needed)
    const canonicalAxis = axisAliases[question.axis] || question.axis;

    if (!questionsByAxis[canonicalAxis]) {
      questionsByAxis[canonicalAxis] = [];
    }
    questionsByAxis[canonicalAxis].push(question);
  });

  // Calculate total score for each axis
  const axisTotals = {};
  const axisAgreeWeights = {};
  const axisDisagreeWeights = {};

  Object.keys(questionsByAxis).forEach((axis) => {
    axisTotals[axis] = questionsByAxis[axis].reduce((total, question) => {
      const score = calculateQuestionScore(question, answers[question._id]);
      return typeof score === "number" ? total + score : total;
    }, 0);

    // Calculate agree weights (C) and disagree weights (B) for each axis
    let totalAgreeWeight = 0;
    let totalDisagreeWeight = 0;

    questionsByAxis[axis].forEach((question) => {
      totalAgreeWeight += question.weight_agree || question.weight || 1;
      totalDisagreeWeight += question.weight_disagree || question.weight || 1;
    });

    axisAgreeWeights[axis] = totalAgreeWeight;
    axisDisagreeWeights[axis] = totalDisagreeWeight;
  });

  // Axis configuration with min/max values
  const axisConfig = {
    "Equity vs. Free Market": { min: -61, max: 61 },
    "Libertarian vs. Authoritarian": { min: -101, max: 101 },
    "Progressive vs. Conservative": { min: -103, max: 103 },
    "Secular vs. Religious": { min: -72, max: 72 },
    "Globalism vs. Nationalism": { min: -86, max: 86 },
  };

  // Calculate normalized scores using new formula (-100 to 100%)
  const axisPercentages = {};
  const rawNormalizedScores = {};
  const displayNormalizedScores = {};

  Object.keys(axisTotals).forEach((axis) => {
    if (!axisConfig[axis]) return;

    const A = axisTotals[axis] || 0; // Raw score
    const B = axisDisagreeWeights[axis] || 0; // Sum of disagree weights
    const C = axisAgreeWeights[axis] || 0; // Sum of agree weights

    // Calculate display scores for this axis
    const displayScore = (A / C) * 50 + 50;

    // Store percentages for each axis
    const leftPercentage = displayScore.toFixed(2);
    const rightPercentage = (100 - displayScore).toFixed(2);

    axisPercentages[axis] = {
      left: leftPercentage,
      right: rightPercentage,
    };

    // Apply the formula: (A-B)/(B+C)*100 to get a percentage between -100% and 100%
    // Handle division by zero by defaulting to 0
    const denominator = B + C;
    const normalizedRaw = denominator === 0 ? 0 : ((A - B) / denominator) * 100;

    // Ensure we have a finite number
    rawNormalizedScores[axis] = isFinite(normalizedRaw)
      ? Math.max(-100, Math.min(100, normalizedRaw))
      : 0;

    // Convert to 0-100 scale for display
    displayNormalizedScores[axis] = Math.round(
      (rawNormalizedScores[axis] + 100) / 2
    );
  });

  // Calculate the axis-specific percentages
  const axisSpecificPercentages = axisPercentages[canonicalName] || {
    left: "50.00",
    right: "50.00",
  };
  const leftPercent = axisSpecificPercentages.left;
  const rightPercent = axisSpecificPercentages.right;

  // Function to determine axis letter based on percentages
  const getDominantAxisLetter = React.useMemo(() => {
    // Convert percentages to numbers for comparison
    const leftPercentNum = parseFloat(leftPercent);
    const rightPercentNum = parseFloat(rightPercent);

    // Determine if we're on the right side (right percentage is higher)
    // This matches the logic in resultsCalculator.js where negative raw scores
    // correspond to right-side letters and positive raw scores to left-side letters
    const isRightSide = rightPercentNum >= leftPercentNum;

    // If left side has higher percentage, return left-side letter
    // Otherwise return right-side letter
    if (!isRightSide) {
      switch (canonicalName) {
        case "Equity vs. Free Market":
          return "E"; // Equity
        case "Libertarian vs. Authoritarian":
          return "L"; // Libertarian
        case "Progressive vs. Conservative":
          return "P"; // Progressive
        case "Secular vs. Religious":
          return "S"; // Secular
        case "Globalism vs. Nationalism":
          return "G"; // Globalism
        default:
          return "?";
      }
    } else {
      switch (canonicalName) {
        case "Equity vs. Free Market":
          return "F"; // Free Market
        case "Libertarian vs. Authoritarian":
          return "A"; // Authoritarian
        case "Progressive vs. Conservative":
          return "C"; // Conservative
        case "Secular vs. Religious":
          return "R"; // Religious
        case "Globalism vs. Nationalism":
          return "N"; // Nationalism
        default:
          return "?";
      }
    }
  }, [leftPercent, rightPercent, canonicalName]);

  // Count questions per axis
  const questionsPerAxis = {};
  Object.keys(questionsByAxis).forEach((axis) => {
    questionsPerAxis[axis] = questionsByAxis[axis].length;
  });

  // Handle potentially invalid score values
  const validScore = typeof score === "number" && !isNaN(score) ? score : 50;
  const validRawScore =
    typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : 0;

  // Make sure we have valid labels
  const safeLeftLabel = leftLabel || "Left";
  const safeRightLabel = rightLabel || "Right";
  const safeUserPosition = userPosition || "Centered";
  const safePositionStrength = positionStrength || "Weak";

  // Assign axis-specific colors based on position and the examples shown
  let leftSideColor = "bg-blue-600";
  let rightSideColor = "bg-green-600";

  // Determine colors based on axis
  switch (canonicalName) {
    case "Equity vs. Free Market":
      leftSideColor = "bg-blue-600"; // Blue for left (Equity)
      rightSideColor = "bg-green-600"; // Green for right (Free Market)
      break;
    case "Libertarian vs. Authoritarian":
      leftSideColor = "bg-teal-500"; // Teal for left (Libertarian)
      rightSideColor = "bg-orange-500"; // Orange for right (Authoritarian)
      break;
    case "Progressive vs. Conservative":
      leftSideColor = "bg-sky-500"; // Sky for left (Progressive)
      rightSideColor = "bg-red-400"; // Red for right (Conservative)
      break;
    case "Secular vs. Religious":
      leftSideColor = "bg-yellow-400"; // Yellow for left (Secular)
      rightSideColor = "bg-purple-500"; // Purple for right (Religious)
      break;
    case "Globalism vs. Nationalism":
      leftSideColor = "bg-lime-500"; // Lime for left (Globalism)
      rightSideColor = "bg-rose-500"; // Rose for right (Nationalism)
      break;
    default:
      // Default colors
      leftSideColor = "bg-blue-600";
      rightSideColor = "bg-green-600";
  }

  // Calculate the strength based on percentage
  const getStrengthFromPercentage = (percent) => {
    const distanceFromCenter = Math.abs(percent - 50);

    if (distanceFromCenter <= 9) {
      return "Leaning";
    } else if (distanceFromCenter <= 19) {
      return "Inclined";
    } else if (distanceFromCenter <= 29) {
      return "Committed";
    } else {
      return "Extreme";
    }
  };

  // Calculate strength based on actual percentages
  const leftPercentNum = parseFloat(leftPercent);
  const rightPercentNum = parseFloat(rightPercent);

  // Determine which side is dominant and calculate its strength
  const isDominantLeft = leftPercentNum > rightPercentNum;
  const dominantPercent = isDominantLeft ? leftPercentNum : rightPercentNum;
  const strengthLabel = getStrengthFromPercentage(dominantPercent);

  useEffect(() => {
    const leftPercent = axisSpecificPercentages.left;
    const rightPercent = axisSpecificPercentages.right;

    // Only update when the percentages actually change
    updatePercents(name, { leftPercent, rightPercent });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, axisSpecificPercentages.left, axisSpecificPercentages.right]);

  // Send the letter to the parent component if callback provided
  useEffect(() => {
    if (onLetterDetermined) {
      onLetterDetermined(canonicalName, getDominantAxisLetter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalName, getDominantAxisLetter]);

  // Send the axis breakdown data to the parent component if callback provided
  useEffect(() => {
    if (onAxisDataUpdate) {
      const axisData = {
        name: canonicalName,
        score: parseFloat(leftPercent),
        rawScore: validRawScore,
        leftLabel: safeLeftLabel,
        rightLabel: safeRightLabel,
        userPosition: isDominantLeft ? safeLeftLabel : safeRightLabel,
        positionStrength: strengthLabel,
        leftPercent: parseFloat(leftPercent),
        rightPercent: parseFloat(rightPercent),
      };
      onAxisDataUpdate(canonicalName, axisData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalName, leftPercent, rightPercent, strengthLabel]);

  // Use the supplied position parameter for the current axis
  // Instead of using displayNormalizedScores, use the actual score directly
  const currentAxisScore = parseFloat(leftPercent);

  // Special handling to ensure the marker is visible at edges
  let markerVisiblePosition = currentAxisScore;
  if (markerVisiblePosition <= 1) markerVisiblePosition = 1;
  if (markerVisiblePosition >= 99) markerVisiblePosition = 99;

  return (
    <div className={`mb-8 axis-graph ${className || ""}`}>
      {/* Axis Title */}
      <h3 className="text-lg font-semibold mb-1">{canonicalName}</h3>

      {/* Axis Labels */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${leftSideColor}`}
          >
            {safeLeftLabel} {isDominantLeft && `(${strengthLabel})`}
          </span>
        </div>
        <div className="text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full text-white ${rightSideColor}`}
          >
            {safeRightLabel} {!isDominantLeft && `(${strengthLabel})`}
          </span>
        </div>
      </div>

      {/* Axis bar - enhanced design with both sides colored */}
      <div className="relative h-10 rounded-full overflow-hidden mt-1 border border-gray-200">
        {/* Left side bar with percentage always visible */}
        <div
          className={`h-full ${leftSideColor} absolute left-0 z-10 flex items-center justify-center`}
          style={{ width: `${leftPercent}%` }}
        >
          {/* Always show percentage */}
          <span className="text-white font-bold text-center px-2 z-20">
            {leftPercent}% {isDominantLeft && `(${getDominantAxisLetter})`}
          </span>
        </div>

        {/* Right side bar with percentage always visible */}
        <div
          className={`h-full ${rightSideColor} absolute right-0 z-10 flex items-center justify-center`}
          style={{ width: `${rightPercent}%` }}
        >
          {/* Always show percentage */}
          <span className="text-white font-bold text-center px-2 z-20">
            {rightPercent}% {!isDominantLeft && `(${getDominantAxisLetter})`}
          </span>
        </div>

        {/* Marker for user's position */}
        <div
          className="absolute top-0 bottom-0 w-1 h-full bg-white border border-black z-30 transform -translate-x-1/2"
          style={{ left: `${markerVisiblePosition}%` }}
        ></div>
      </div>

      {/* Axis scale indicators */}
      {/* <div className="flex justify-between mt-1 text-xs text-gray-700">
        <div>-100%</div>
        <div>0%</div>
        <div>+100%</div>
      </div> */}

      {/* Position description */}
      <div className="mt-2 text-sm text-gray-700">
        {getPositionDescription(
          canonicalName,
          markerVisiblePosition,
          strengthLabel
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to generate a description of the user's position on the axis
 */
function getPositionDescription(axis, score, strength) {
  // Define axis aliases
  const AXIS_ALIASES = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Use canonical axis name if an alias exists
  const canonicalAxis = AXIS_ALIASES[axis] || axis;

  // Get the appropriate side label based on the score
  let sideLabel;
    if (canonicalAxis === "Equity vs. Free Market") {
      sideLabel = score < 50 ? "Equity" : "Free Market";
  } else if (canonicalAxis === "Libertarian vs. Authoritarian") {
    sideLabel = score < 50 ? "Libertarian" : "Authoritarian";
  } else if (canonicalAxis === "Progressive vs. Conservative") {
    sideLabel = score < 50 ? "Conservative" : "Progressive";
  } else if (canonicalAxis === "Secular vs. Religious") {
    sideLabel = score < 50 ? "Religious" : "Secular";
  } else if (canonicalAxis === "Globalism vs. Nationalism") {
    sideLabel = score < 50 ? "Nationalist" : "Globalist";
  } else {
    return "Your position on this axis reflects a balance between the opposing viewpoints.";
  }

  // Map the strength to the new categories
  let strengthCategory;
  if (!strength) {
    strengthCategory = "Leaning"; // Default
  } else if (strength === "Leaning") {
    strengthCategory = "Leaning";
  } else if (strength === "Inclined") {
    strengthCategory = "Inclined";
  } else if (strength === "Committed") {
    strengthCategory = "Committed";
  } else if (strength === "Extreme") {
    strengthCategory = "Extreme";
  } else {
    // For backward compatibility with old strength values
    if (strength.toLowerCase() === "weak") {
      strengthCategory = "Leaning";
    } else if (strength.toLowerCase() === "moderate") {
      strengthCategory = "Inclined";
    } else if (strength.toLowerCase() === "strong") {
      strengthCategory = "Committed";
    } else {
      strengthCategory = "Leaning"; // Default fallback
    }
  }

  // Comprehensive descriptions for each position and strength level
  const descriptions = {
    Equity: {
      Leaning:
        "You show a moderate preference for equity-based solutions, believing that everyone should have a fair shot at success, even if starting from different circumstances. While you recognize the importance of markets in driving innovation and growth, you believe government should step in to correct for structural disadvantages and provide a baseline of opportunity for all citizens.",
      Inclined:
        "You tend to support policies that actively reduce inequality through taxation, social programs, and accessible public services. You see economic disparity not just as a byproduct of the market, but as a social and moral issue. While you're not entirely against free markets, you believe they must operate under strict rules to prevent exploitation and to protect the most vulnerable in society.",
      Committed:
        "You firmly believe that economic fairness is foundational to a just society. You view wealth redistribution, universal healthcare, affordable housing, and strong labor protections not as optional ideals, but as essential rights. For you, markets should exist only when they serve the public good, and unchecked capitalism is seen as a source of societal harm that needs to be curtailed by democratic institutions.",
      Extreme:
        "You envision a fundamentally transformed society where economic systems are rebuilt around principles of collective ownership, universal dignity, and justice. You may advocate for the abolition or radical restructuring of traditional market systems, believing that capitalism inherently breeds inequality. You seek a world where resources and wealth are equitably shared, and where human needs take precedence over profit or competition.",
    },

    "Free Market": {
      Leaning:
        "You generally favor market-based solutions to social and economic challenges, viewing private enterprise as a key engine of innovation and individual empowerment. While you acknowledge the need for some regulation to ensure fair play, you believe that competition and consumer choice usually lead to better outcomes than centralized planning.",
      Inclined:
        "You prefer a system where the government plays a minimal role in economic affairs. You trust that free markets, when left largely to their own devices, will allocate resources efficiently and reward hard work. Taxes, subsidies, and excessive regulation are seen as distortions that often do more harm than good.",
      Committed:
        "You firmly believe in the power of laissez-faire capitalism, advocating for low taxes, minimal government oversight, and robust protection of private property. You view regulation and redistribution not just as inefficient, but as infringements on individual liberty and barriers to prosperity. Markets, you argue, are self-correcting and should be trusted to guide society forward.",
      Extreme:
        "You envision a society built almost entirely around voluntary exchange, where markets—not governments—solve nearly all problems, from healthcare to education. You may support privatizing public services, abolishing welfare programs, and reducing the state’s role to little more than defending property rights. Any form of economic coercion by the state is seen as a threat to freedom and a slippery slope toward authoritarianism.",
    },
    
      "Libertarian": {
        Leaning:
          "You lean toward individual freedom and personal autonomy, believing that people should generally be trusted to make their own choices. While you accept a role for government in limited matters like public safety, you prefer solutions that reduce coercion and maximize liberty.",
        Inclined:
          "You prefer a political system where government interference is minimized and civil liberties are strongly protected. You believe that voluntary association and free expression are the cornerstones of a healthy society, and that too much regulation stifles personal and economic freedom.",
        Committed:
          "You strongly believe that freedom from state intrusion is essential to human flourishing. You advocate for minimal government, low taxation, and a robust defense of personal rights. In your view, individual liberty should be the default, and state power must be rigorously constrained.",
        Extreme:
          "You advocate for a radically free society where nearly all aspects of life are governed by voluntary interaction rather than government force. You may support abolishing entire government functions, including taxes, police, and welfare programs, favoring a decentralized or even stateless model rooted in personal sovereignty.",
      },
      
      "Authoritarian": {
        Leaning:
          "You think society benefits from a little more structure and discipline. While you value personal freedoms, you also believe government should play a firmer role in upholding public order and ensuring stability.",
        Inclined:
          "You prefer a strong government that maintains law, tradition, and national cohesion. You see centralized authority as necessary to counter social fragmentation and to enforce values that bind society together.",
        Committed:
          "You believe that an orderly, functioning society depends on decisive leadership and institutional strength. You support top-down governance, loyalty to the state, and the use of authority to maintain unity and suppress harmful dissent.",
        Extreme:
          "You favor a powerful, centralized state that controls many aspects of life in order to preserve national identity, morality, and order. You may support censorship, surveillance, and heavy regulation as tools to eliminate chaos and enforce discipline across society.",
      },
      
      "Progressive": {
        Leaning:
          "You support moderate reforms aimed at improving society, especially in areas like civil rights, education, and economic justice. You’re open to new ideas and social experimentation that challenge outdated norms.",
        Inclined:
          "You favor a future-focused society, open to innovation and inclusive of marginalized voices. You believe change is necessary for moral and social progress, even if it means confronting tradition and entrenched interests.",
        Committed:
          "You strongly advocate for comprehensive societal reform to advance equality, sustainability, and justice. You view progress as both a moral and practical imperative, and believe government and institutions must evolve with changing times.",
        Extreme:
          "You envision a complete transformation of society—politically, culturally, and economically. You may seek to dismantle systemic power structures and replace them with radically inclusive and equitable alternatives. In your view, clinging to old norms only hinders human progress.",
      },
      
      "Conservative": {
        Leaning:
          "You respect tradition and established systems, believing that they provide valuable stability and wisdom. While you accept some change is inevitable, it should be cautious and well considered.",
        Inclined:
          "You believe time-tested values, cultural heritage, and institutions form the backbone of a stable society. You support reforms only when they uphold order, responsibility, and respect for tradition.",
        Committed:
          "You strongly uphold traditional norms, religious principles, and a moral social fabric. You see progressive change as often misguided or dangerous, and advocate for preserving the cultural and institutional status quo.",
        Extreme:
          "You advocate for a society firmly rooted in tradition, hierarchy, and cultural continuity. You may resist modern values entirely, seeking to reverse social changes you view as corrosive and restore older ways of life as the foundation of national strength.",
      },
      
      "Secular": {
        Leaning:
          "You prefer a clear boundary between religious belief and public decision-making. While you respect faith on a personal level, you believe government and policy should remain neutral and rational.",
        Inclined:
          "You believe that religion should remain private, and that secular ethics grounded in reason and universal values are the best foundation for law and governance. You are cautious about religious influence in politics or education.",
        Committed:
          "You strongly support a secular society where rational inquiry and pluralism take precedence. You view religious institutions as having no place in crafting public policy, and favor strict separation between church and state.",
        Extreme:
          "You advocate for a fully secular public sphere, free from religious influence or symbolism. You may view organized religion as inherently regressive or oppressive, and believe society should be grounded entirely in science, logic, and humanist principles.",
      },
      
      "Religious": {
        Leaning:
          "You see religious values as offering useful moral guidance for individuals and society. While not necessarily central to governance, you believe faith has an important role to play in public life.",
        Inclined:
          "You believe that religious beliefs and traditions provide meaning, cohesion, and moral structure to society. You support policies and cultural norms that reflect those values in the public sphere.",
        Committed:
          "You believe religion is a vital foundation for law, ethics, and community. You support a society where religious teachings inform governance, public policy, and social expectations.",
        Extreme:
          "You advocate for a theologically grounded society in which religious authority shapes law and morality. You may support formal integration of religious doctrine into state functions, seeing faith as inseparable from public life and national identity.",
      },
      
      "Globalist": {
        Leaning:
          "You lean toward international cooperation and shared responsibility. While you recognize national interests, you believe that many challenges—like climate change and human rights—require global solutions.",
        Inclined:
          "You support interconnected economies, cross-border partnerships, and global institutions. You see cultural exchange and multilateralism as positive forces for peace, prosperity, and understanding.",
        Committed:
          "You believe humanity is stronger when nations work together. You support global frameworks that prioritize shared values over national rivalry, and may view yourself as a citizen of the world as much as of any one country.",
        Extreme:
          "You advocate for a post-national world in which global governance, human solidarity, and universal values transcend borders. You may support ceding national sovereignty to international bodies in the name of unity, justice, and planetary stewardship.",
      },
      
      "Nationalist": {
        Leaning:
          "You lean toward prioritizing your country’s interests, culture, and identity—while still valuing peaceful global relations. You believe national pride is healthy and cohesion is worth preserving.",
        Inclined:
          "You believe that nations should put their own people first. You favor strong borders, self-determination, and cultural preservation over international commitments that might dilute sovereignty.",
        Committed:
          "You strongly prioritize national independence, tradition, and unity. You are skeptical of global institutions and advocate for policies that maintain a distinct national identity and economic self-sufficiency.",
        Extreme:
          "You advocate for a fully self-reliant nation, culturally and economically. You may oppose immigration, foreign influence, or multilateralism, and support policies aimed at restoring national greatness and defending against global homogenization.",
      },
  };

  // Return the appropriate description or a default message if not found
  return (
    descriptions[sideLabel]?.[strengthCategory] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
