import React, { useState, useEffect } from "react";
import { FaBrain, FaSpinner, FaLightbulb, FaChartPie } from "react-icons/fa";

const AXIS_NAMES = [
  "Equity vs. Free Market",
  "Libertarian vs. Authoritarian",
  "Progressive vs. Conservative",
  "Secular vs. Religious",
  "Globalism vs. Nationalism",
];

const AISummaryCard = ({
  axisName,
  summary,
  loading,
  onGenerate,
  axisAnswers,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
          <FaChartPie className="text-blue-600 text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{axisName}</h3>
          <p className="text-sm text-gray-600">
            {axisAnswers?.length || 0} questions analyzed
          </p>
        </div>
      </div>

      {!summary && !loading && (
        <div className="text-center py-6">
          <FaLightbulb className="text-gray-400 text-3xl mx-auto mb-3" />
          <p className="text-gray-600 mb-4 text-sm">
            Generate a detailed analysis focused specifically on your{" "}
            {axisName.toLowerCase()} positioning
          </p>
          <button
            onClick={() => onGenerate(axisName)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Generate Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-6">
          <FaSpinner className="text-blue-600 text-2xl mx-auto mb-3 animate-spin" />
          <p className="text-gray-600 text-sm">
            AI is analyzing your {axisName.toLowerCase()} positioning...
          </p>
        </div>
      )}

      {summary && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaBrain className="text-blue-600 text-lg mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">
                  {axisName} Analysis
                </h4>
                <div
                  className={`text-gray-700 leading-relaxed text-sm ${
                    !isExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {summary}
                </div>
                {summary.length > 200 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-800"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AxisSpecificSummaries = ({
  answers,
  userEmail,
  isPhilosiQPlus,
  axisDataByName = {},
  pregeneratedSummaries = {},
  pregeneratedLoading = {},
  pregeneratedErrors = {},
}) => {
  const [summaries, setSummaries] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});

  // Use pregenerated data if available
  useEffect(() => {
    if (Object.keys(pregeneratedSummaries).length > 0) {
      setSummaries(pregeneratedSummaries);
    }
    if (Object.keys(pregeneratedLoading).length > 0) {
      setLoadingStates(pregeneratedLoading);
    }
    if (Object.keys(pregeneratedErrors).length > 0) {
      setErrors(pregeneratedErrors);
    }
  }, [pregeneratedSummaries, pregeneratedLoading, pregeneratedErrors]);

  // Group answers by axis
  const getAxisAnswers = (axisName) => {
    if (!answers || !Array.isArray(answers)) return [];

    // Debug: Log the filtering process
    console.log(`=== FILTERING FOR ${axisName} ===`);
    console.log("Total answers to filter:", answers.length);
    console.log("Sample answer:", answers[0]);

    const filteredAnswers = answers.filter((answer) => {
      // Use the standardized axis names and check for exact matches or variations
      const axisMapping = {
        "Equity vs. Free Market": [
          "Equity vs. Free Market",
          "equity",
          "free market",
          "economic",
          "market",
        ],
        "Libertarian vs. Authoritarian": [
          "Libertarian vs. Authoritarian",
          "libertarian",
          "authoritarian",
          "freedom",
          "control",
        ],
        "Progressive vs. Conservative": [
          "Progressive vs. Conservative",
          "progressive",
          "conservative",
          "change",
          "tradition",
        ],
        "Secular vs. Religious": [
          "Secular vs. Religious",
          "secular",
          "religious",
          "religion",
          "faith",
        ],
        "Globalism vs. Nationalism": [
          "Globalism vs. Nationalism",
          "globalism",
          "nationalism",
          "global",
          "national",
        ],
      };

      const targetAxes = axisMapping[axisName] || [];
      const answerAxis = answer.axis?.toLowerCase() || "";

      // Debug: Log each answer being checked
      console.log(
        `Checking answer: axis="${
          answer.axis
        }", question="${answer.question?.substring(0, 50)}..."`
      );

      // Check for exact matches first, then partial matches
      const matches = targetAxes.some((targetAxis) => {
        const targetLower = targetAxis.toLowerCase();
        return answerAxis === targetLower || answerAxis.includes(targetLower);
      });

      if (matches) {
        console.log(`✓ MATCH: "${answer.question?.substring(0, 50)}..."`);
      }

      return matches;
    });

    console.log(`Filtered answers for ${axisName}:`, filteredAnswers.length);
    return filteredAnswers;
  };

  const generateAxisSummary = async (axisName) => {
    const axisAnswers = getAxisAnswers(axisName);

    if (axisAnswers.length === 0) {
      setErrors((prev) => ({
        ...prev,
        [axisName]: "No questions found for this axis",
      }));
      return;
    }

    // Debug: Log the answers being sent
    console.log(`=== DEBUG: ${axisName} ===`);
    console.log("Axis answers:", axisAnswers);
    console.log("Sample answer structure:", axisAnswers[0]);

    setLoadingStates((prev) => ({ ...prev, [axisName]: true }));
    setErrors((prev) => ({ ...prev, [axisName]: "" }));

    try {
      const response = await fetch("/api/ai/generate-axis-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          axisName,
          answers: axisAnswers,
          userEmail: userEmail || "", // Handle null/undefined userEmail
          userId: localStorage.getItem("userId") || "unknown",
          axisData: axisDataByName[axisName] || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate axis summary");
      }

      setSummaries((prev) => ({ ...prev, [axisName]: data.summary }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [axisName]: err.message }));
      console.error(`Axis summary generation error for ${axisName}:`, err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [axisName]: false }));
    }
  };

  // Locked card component for free users
  const LockedAxisCard = ({ axisName, axisAnswers }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Lock indicator */}
      <div className="absolute top-4 right-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Card content */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
          <FaChartPie className="text-blue-600 text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{axisName}</h3>
          <p className="text-sm text-gray-600">
            {axisAnswers?.length || 0} questions analyzed
          </p>
        </div>
      </div>

      <div className="text-center py-6">
        <FaLightbulb className="text-gray-400 text-3xl mx-auto mb-3" />
        <p className="text-gray-600 mb-4 text-sm">
          Generate a detailed analysis focused specifically on your{" "}
          {axisName.toLowerCase()} positioning
        </p>
        <button
          onClick={() => (window.location.href = "/profile")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          Upgrade to Unlock
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <FaBrain className="text-blue-600" />
          Axis-Specific AI Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Get detailed, personalized analysis for each political dimension. Each
          summary focuses specifically on your answers and positioning for that
          particular axis, providing deeper insights than general analysis.
        </p>

        {!isPhilosiQPlus && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-purple-700 text-sm">
              <strong>Philosiq+ Exclusive:</strong> Unlock all 5 detailed axis
              analyses to get comprehensive insights into your political
              positioning.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AXIS_NAMES.map((axisName) => {
          if (!isPhilosiQPlus) {
            return (
              <LockedAxisCard
                key={axisName}
                axisName={axisName}
                axisAnswers={getAxisAnswers(axisName)}
              />
            );
          }

          return (
            <AISummaryCard
              key={axisName}
              axisName={axisName}
              summary={summaries[axisName]}
              loading={loadingStates[axisName]}
              error={errors[axisName]}
              onGenerate={generateAxisSummary}
              axisAnswers={getAxisAnswers(axisName)}
            />
          );
        })}
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mt-6">
          {Object.entries(errors).map(
            ([axisName, error]) =>
              error && (
                <div
                  key={axisName}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3"
                >
                  <p className="text-red-700 text-sm">
                    <strong>{axisName}:</strong> {error}
                  </p>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default AxisSpecificSummaries;
