import React from "react";

/**
 * Component to display a visual representation of a political axis
 * with the user's position marked
 */
export default function AxisGraph({
  name,
  score = 50,
  rawScore = 0, // This is the -100 to 100 score
  leftLabel,
  rightLabel,
  positionStrength,
  userPosition,
  className = "",
}) {
  // Calculate the position as a percentage (0-100) for the UI
  const position = Math.max(0, Math.min(100, score));

  // Ensure rawScore is a number
  const actualRawScore =
    typeof rawScore === "number"
      ? rawScore
      : typeof rawScore === "string"
      ? parseFloat(rawScore)
      : 0;

  // Use the actual raw score for all axes (no special cases)
  const finalRawScore = actualRawScore;

  // Show normalized percentage in a more user-friendly way
  const displayPosition =
    finalRawScore === 0
      ? "0"
      : (finalRawScore > 0 ? "+" : "") + finalRawScore.toFixed(0);

  // Assign axis-specific colors based on position and the examples shown
  let positionColor;

  // Determine colors based on axis and position
  switch (name) {
    case "Equity vs. Free Market":
      positionColor = "bg-red-600"; // Strong market position (red color from example)
      break;
    case "Libertarian vs. Authoritarian":
      positionColor = finalRawScore < 0 ? "bg-gray-500" : "bg-orange-500"; // Orange for right side
      break;
    case "Progressive vs. Conservative":
      positionColor = finalRawScore < 0 ? "bg-gray-500" : "bg-blue-400"; // Blue for right side
      break;
    case "Secular vs. Religious":
      positionColor = finalRawScore < 0 ? "bg-yellow-400" : "bg-gray-300"; // Yellow for left side
      break;
    case "Globalism vs. Nationalism":
      positionColor = finalRawScore < 0 ? "bg-gray-500" : "bg-green-500"; // Green for right side
      break;
    default:
      // Default color logic based on position strength
      if (userPosition !== "Centered") {
        if (positionStrength === "Strong") {
          positionColor = position < 50 ? "bg-blue-600" : "bg-red-600";
        } else if (positionStrength === "Moderate") {
          positionColor = position < 50 ? "bg-blue-500" : "bg-red-500";
        } else {
          // Weak
          positionColor = position < 50 ? "bg-blue-400" : "bg-red-400";
        }
      } else {
        positionColor = "bg-gray-500"; // Default for neutral/centered
      }
  }

  // Calculate the width and position for the bar
  // For correct filling direction from center
  const barWidth = `${Math.abs(finalRawScore) / 2}%`;
  const barStart = finalRawScore >= 0 ? "left-1/2" : "right-1/2";

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-white text-sm ${
              positionStrength === "Weak" ? "bg-gray-500" : positionColor
            }`}
          >
            {userPosition} {positionStrength && `(${positionStrength})`}
          </span>
          <span className="font-bold">{displayPosition}%</span>
        </div>
      </div>

      {/* Axis bar - enhanced design */}
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Center marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400 z-10"></div>

        {/* Left and right labels directly on the axis */}
        <div className="absolute top-0 left-2 text-xs font-semibold text-gray-600 z-10 leading-8">
          {leftLabel}
        </div>
        <div className="absolute top-0 right-2 text-xs font-semibold text-gray-600 z-10 leading-8">
          {rightLabel}
        </div>

        {/* Position indicator bar */}
        <div
          className={`h-full ${positionColor} transition-all duration-500 ease-out absolute ${barStart}`}
          style={{ width: barWidth }}
        ></div>

        {/* Marker for user's position */}
        <div
          className="absolute top-0 bottom-0 w-2 h-full bg-white border-2 border-black z-20 transform -translate-x-1/2"
          style={{ left: `${(finalRawScore + 100) / 2}%` }}
        ></div>
      </div>

      {/* Axis scale indicators */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <div>-100%</div>
        <div>0%</div>
        <div>+100%</div>
      </div>

      {/* Position description */}
      <div className="mt-3 text-sm text-gray-700">
        {getPositionDescription(name, position, positionStrength)}
      </div>
    </div>
  );
}

/**
 * Helper function to generate a description of the user's position on the axis
 */
function getPositionDescription(axis, score, strength) {
  const position = score < 50 ? "left" : "right";
  const intensity = strength?.toLowerCase() || "moderate";

  // Define axis aliases
  const AXIS_ALIASES = {
    "Equality vs. Markets": "Equity vs. Free Market",
  };

  // Use canonical axis name if an alias exists
  const canonicalAxis = AXIS_ALIASES[axis] || axis;

  const descriptions = {
    "Equity vs. Free Market": {
      left: {
        weak: "You have a slight preference for economic equality and redistributive policies, but you also see value in market mechanisms.",
        moderate:
          "You believe economic equality is important and favor policies that reduce wealth disparities through government intervention.",
        strong:
          "You strongly favor economic equality and robust government intervention to ensure fair distribution of resources.",
      },
      right: {
        weak: "You have a slight preference for free markets, while recognizing the need for some economic regulations.",
        moderate:
          "You favor market-based solutions and believe economic freedom leads to greater innovation and prosperity.",
        strong:
          "You strongly support free markets with minimal government intervention and believe market forces should determine economic outcomes.",
      },
    },
    "Libertarian vs. Authoritarian": {
      left: {
        weak: "You generally favor individual liberties with limited government authority, but recognize the need for some regulations.",
        moderate:
          "You value individual freedoms and prefer a government with limited powers over personal matters.",
        strong:
          "You strongly prioritize individual liberties and believe government authority should be highly restricted.",
      },
      right: {
        weak: "You believe in balanced governance with some authority, while still respecting individual rights.",
        moderate:
          "You favor stronger governmental authority to maintain order and implement effective policies.",
        strong:
          "You strongly believe in the necessity of centralized authority to ensure order, security, and effective governance.",
      },
    },
    "Progressive vs. Conservative": {
      left: {
        weak: "You generally favor gradual social change while respecting some traditional values.",
        moderate:
          "You embrace social progress and are open to reforming institutions to better serve evolving societal needs.",
        strong:
          "You strongly advocate for social change and believe in continuously reforming institutions to address injustices.",
      },
      right: {
        weak: "You value some traditional practices while being open to moderate social changes.",
        moderate:
          "You value traditional institutions and believe in preserving established social structures and practices.",
        strong:
          "You strongly prioritize traditional values and believe in preserving established institutions against rapid change.",
      },
    },
    "Secular vs. Religious": {
      left: {
        weak: "You generally favor secular reasoning in governance while respecting religious beliefs in society.",
        moderate:
          "You believe public policy should be guided by secular reasoning, separate from religious doctrine.",
        strong:
          "You strongly advocate for secular governance and clear separation between religious institutions and state functions.",
      },
      right: {
        weak: "You recognize the value of religious perspectives in public life, while supporting basic separation of church and state.",
        moderate:
          "You believe religious values and traditions should inform public policy and social norms.",
        strong:
          "You strongly believe religious principles should guide governance and play a central role in public life.",
      },
    },
    "Globalism vs. Nationalism": {
      left: {
        weak: "You generally support international cooperation while maintaining important national interests.",
        moderate:
          "You value international institutions and favor cooperation between nations on global challenges.",
        strong:
          "You strongly prioritize global solutions and believe nations should increasingly integrate into international frameworks.",
      },
      right: {
        weak: "You believe in protecting national interests while engaging in beneficial international cooperation.",
        moderate:
          "You prioritize national sovereignty and believe countries should put their citizens' interests first.",
        strong:
          "You strongly believe in national independence and prioritizing citizens' interests over international obligations.",
      },
    },
  };

  // Return appropriate description or a default message if not found
  return (
    descriptions[canonicalAxis]?.[position]?.[intensity] ||
    "Your position on this axis reflects a balance between the opposing viewpoints."
  );
}
