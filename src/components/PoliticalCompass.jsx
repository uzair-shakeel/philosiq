import React from "react";

const PoliticalCompass = ({ axisResults, answers, questions }) => {
  // Calculate compass position based on actual axis percentages
  const calculateCompassPosition = () => {
    if (!axisResults) return { x: 0, y: 0 };

    // Map axes to compass dimensions - handle multiple possible axis names
    // Horizontal: Equity vs Free Market (Equity-Market)
    // Vertical: Libertarian vs Authoritarian (Libertarian-Authoritarian)
    const marketAxis = axisResults.find(
      (axis) =>
        axis.name === "Equity vs. Free Market" ||
        axis.name === "Equality vs. Markets" ||
        axis.name.toLowerCase().includes("market") ||
        axis.name.toLowerCase().includes("equity")
    );

    const libertarianAxis = axisResults.find(
      (axis) =>
        axis.name === "Libertarian vs. Authoritarian" ||
        axis.name.toLowerCase().includes("libertarian") ||
        axis.name.toLowerCase().includes("authoritarian")
    );
    if (!marketAxis || !libertarianAxis) {
      return { x: 0, y: 0 };
    }

    // =============================================================================
    // DOT POSITION CALCULATION LOGIC
    // =============================================================================

    // STEP 1: Convert percentage scores to compass coordinates (-1 to 1 scale)
    // Formula: (percentage - 50) / 50
    // Examples:
    //   0% → (0-50)/50 = -1.0 (far left/bottom)
    //   25% → (25-50)/50 = -0.5 (left/bottom of center)
    //   50% → (50-50)/50 = 0.0 (center)
    //   75% → (75-50)/50 = 0.5 (right/top of center)
    //   100% → (100-50)/50 = 1.0 (far right/top)
    const percentageToCompassScale = (percentage) => {
      return (percentage - 50) / 50;
    };

    // STEP 2: Get the actual axis percentages from the results
    const marketPercentage = marketAxis.score || 50; // X-axis: Equity vs Free Market
    const libertarianPercentage = libertarianAxis.score || 50; // Y-axis: Libertarian vs Authoritarian

    // STEP 3: Calculate compass coordinates (-1 to 1 scale)
    // X-axis mapping: 0% Equity = -1, 50% = 0, 100% Free Market = 1
    // Y-axis mapping: 0% Libertarian = -1, 50% = 0, 100% Authoritarian = 1
    const x = percentageToCompassScale(marketPercentage);
    const y = percentageToCompassScale(libertarianPercentage);

    // EXAMPLES with your current data:
    // Market: 56% → x = (56-50)/50 = 0.12 (slightly right of center)
    // Libertarian: 83% → y = (83-50)/50 = 0.66 (high up toward Authoritarian)

    return { x, y };
  };

  console.log("axisResultsssss", axisResults);

  // Count strongly agree/disagree answers for each axis
  const getStrongAnswersCount = () => {
    if (!answers || !questions) return {};

    const strongAnswers = {};

    // Group answers by axis
    questions.forEach((question) => {
      const answer = answers[question._id];
      if (answer !== undefined && Math.abs(answer) === 2) {
        const axis = question.axis;
        if (!strongAnswers[axis]) {
          strongAnswers[axis] = { agree: 0, disagree: 0 };
        }
        if (answer === 2) {
          strongAnswers[axis].agree++;
        } else {
          strongAnswers[axis].disagree++;
        }
      }
    });

    return strongAnswers;
  };

  const strongAnswers = getStrongAnswersCount();

  // Find the axes directly for pixel calculation
  const marketAxis = axisResults?.find(
    (axis) =>
      axis.name === "Equity vs. Free Market" ||
      axis.name === "Equality vs. Markets" ||
      axis.name.toLowerCase().includes("market") ||
      axis.name.toLowerCase().includes("equity")
  );
  const libertarianAxis = axisResults?.find(
    (axis) =>
      axis.name === "Libertarian vs. Authoritarian" ||
      axis.name.toLowerCase().includes("libertarian") ||
      axis.name.toLowerCase().includes("authoritarian")
  );

  // =============================================================================
  // SIMPLIFIED PIXEL CALCULATION - DIRECT PERCENTAGE TO PIXELS
  // =============================================================================

  const compassSize = 600; // Total canvas size: 600x600 pixels
  const center = compassSize / 2; // Center point: 300px (needed for SVG lines)
  const margin = 20; // 20px margin on each side
  const pixelPerPercent = 5.6; // 560px usable area ÷ 100% = 5.6 pixels per percent

  // STEP 4: Direct percentage to pixel conversion
  // X-axis: 0% = 20px (left), 100% = 580px (right)
  // Use rightPercent for market axis (Free Market percentage)
  const marketPercentage = marketAxis?.rightPercent || 50;
  const markerX = margin + marketPercentage * pixelPerPercent;

  // Y-axis: 0% = 580px (bottom), 100% = 20px (top) - INVERTED
  // Use rightPercent for libertarian axis (Authoritarian percentage)
  const libertarianPercentage = libertarianAxis?.rightPercent || 50;
  const markerY =
    compassSize - margin - libertarianPercentage * pixelPerPercent;

  // =============================================================================
  // EXAMPLES WITH YOUR DATA:
  // Market: 56% → markerX = 20 + (56 × 5.6) = 20 + 313.6 = 333.6px
  // Libertarian: 83% → markerY = 580 - (83 × 5.6) = 580 - 464.8 = 115.2px
  // =============================================================================

  // Check if we have the required data
  if (!axisResults || !answers || !questions) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Political Compass
        </h3>
        <div className="text-center text-gray-500">
          <p>Unable to generate political compass - missing data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex flex-col items-center">
        {/* Compass Grid */}
        <div className="relative my-4">
          <svg
            width={compassSize}
            height={compassSize}
            className="border border-gray-300"
            viewBox={`0 0 ${compassSize} ${compassSize}`}
          >
            {/* Background quadrants matching the political compass layout */}
            <rect
              x="0"
              y="0"
              width={compassSize / 2}
              height={compassSize / 2}
              fill="#fecaca"
            />{" "}
            {/* Top-left: Red/Pink (Equity + Authoritarian) */}
            <rect
              x={compassSize / 2}
              y="0"
              width={compassSize / 2}
              height={compassSize / 2}
              fill="#bfdbfe"
            />{" "}
            {/* Top-right: Light Blue (Free Market + Authoritarian) */}
            <rect
              x="0"
              y={compassSize / 2}
              width={compassSize / 2}
              height={compassSize / 2}
              fill="#bbf7d0"
            />{" "}
            {/* Bottom-left: Light Green (Equity + Libertarian) */}
            <rect
              x={compassSize / 2}
              y={compassSize / 2}
              width={compassSize / 2}
              height={compassSize / 2}
              fill="#fef3c7"
            />{" "}
            {/* Bottom-right: Light Yellow (Free Market + Libertarian) */}
            {/* Fine grid pattern overlay - making each pixel visible */}
            {/* Vertical grid lines */}
            {Array.from({ length: 61 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={(compassSize / 60) * i}
                y1="0"
                x2={(compassSize / 60) * i}
                y2={compassSize}
                stroke="#d1d5db"
                strokeWidth="1"
                opacity="1"
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: 61 }, (_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={(compassSize / 60) * i}
                x2={compassSize}
                y2={(compassSize / 60) * i}
                stroke="#d1d5db"
                strokeWidth="1"
                opacity="0.7"
              />
            ))}
            {/* Main axis lines (thicker) */}
            <line
              x1={center}
              y1="0"
              x2={center}
              y2={compassSize}
              stroke="#6b7280"
              strokeWidth="3"
            />
            <line
              x1="0"
              y1={center}
              x2={compassSize}
              y2={center}
              stroke="#6b7280"
              strokeWidth="3"
            />
            {/* User position marker */}
            <circle
              cx={markerX}
              cy={markerY}
              r="12"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="3"
            />
            {/* Center dot for position */}
            <circle cx={markerX} cy={markerY} r="5" fill="#ffffff" />
          </svg>

          {/* Axis labels outside the SVG */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Equity label */}
            <div className="absolute left-6 top-1/2 -rotate-90 transform -translate-y-1/2 -translate-x-16 text-lg font-medium text-gray-700">
              Equity
            </div>
            {/* Free Market label */}
            <div className="absolute -right-12 top-1/2 rotate-90 transform -translate-y-1/2 translate-x-4 text-lg font-medium text-gray-700">
              Free Market
            </div>
            {/* Authoritarian label */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-lg font-medium text-gray-700">
              Authoritarian
            </div>
            {/* Libertarian label */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 text-lg font-medium text-gray-700">
              Libertarian
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticalCompass;
