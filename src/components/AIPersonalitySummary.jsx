import React, { useState, useEffect } from "react";
import { FaBrain, FaLock, FaSpinner, FaLightbulb } from "react-icons/fa";

const AIPersonalitySummary = ({
  answers,
  userEmail,
  isPhilosiQPlus,
  axisDataByName = {},
  pregeneratedSummary = "",
  pregeneratedLoading = false,
  pregeneratedError = "",
}) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [summaryInfo, setSummaryInfo] = useState(null);

  // Use pregenerated summary or auto-generate if not available
  useEffect(() => {
    try {
      if (!answers || answers.length === 0) return;

      // Use pregenerated summary if available
      if (pregeneratedSummary && pregeneratedSummary.trim() !== "") {
        setSummary(pregeneratedSummary);
        setLoading(false);
        setError("");
        return;
      }

      // Use pregenerated error if available
      if (pregeneratedError) {
        setError(pregeneratedError);
        setLoading(false);
        return;
      }

      // Use pregenerated loading state
      if (pregeneratedLoading) {
        setLoading(true);
        setError("");
        return;
      }

      // Fallback to auto-generation if no pregenerated data
      if (loading || summary) return; // already in progress or done
      const cacheKey =
        userEmail && userEmail.trim() !== ""
          ? userEmail
          : `anonymous_${JSON.stringify(answers).length}`;
      const sessionFlagKey = `aiSummaryGenerated_${cacheKey}`;
      const alreadyGenerated =
        sessionStorage.getItem(sessionFlagKey) === "true";
      if (!alreadyGenerated) {
        // Fire and forget; generateSummary already has safety checks
        generateSummary();
      }
    } catch (e) {
      // Non-blocking
      console.warn("Auto-generate summary skipped:", e);
    }
  }, [
    answers,
    userEmail,
    pregeneratedSummary,
    pregeneratedLoading,
    pregeneratedError,
  ]);

  const generateSummary = async () => {
    if (loading || summary) return; // prevent duplicate triggers
    if (!answers || answers.length === 0) {
      setError("No answers available for analysis");
      return;
    }

    console.log("=== FRONTEND DEBUG ===");
    console.log("User tier:", isPhilosiQPlus ? "Philosiq+" : "Free");
    console.log("Total answers:", answers.length);
    console.log("Sample answers:", answers.slice(0, 3));
    console.log("User email:", userEmail);
    console.log("=== END FRONTEND DEBUG ===");

    setLoading(true);
    setError("");

    try {
      const cacheKey =
        userEmail && userEmail.trim() !== ""
          ? userEmail
          : `anonymous_${JSON.stringify(answers).length}`;
      const sessionFlagKey = `aiSummaryGenerated_${cacheKey}`;

      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answers,
          userEmail: userEmail || "", // Handle null/undefined userEmail
          userId: localStorage.getItem("userId") || "unknown",
          axisDataByName: axisDataByName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
      setSummaryInfo({
        cached: data.cached,
        tokensUsed: data.tokensUsed,
        isLimited: data.isLimited,
        totalAnswers: data.totalAnswers,
        processedAnswers: data.processedAnswers,
      });

      // Mark as generated for this session so we don't re-generate
      try {
        sessionStorage.setItem(sessionFlagKey, "true");
      } catch {}

      // Persist the generated summary so it can be saved with quiz history
      try {
        sessionStorage.setItem("aiSummary", data.summary || "");
      } catch {}

      if (data.cached) {
        console.log("Using cached summary");
      } else {
        console.log(`Generated new summary using ${data.tokensUsed} tokens`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Summary generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isPhilosiQPlus) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <FaLightbulb className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              AI Personality Analysis
            </h3>
            <p className="text-sm text-gray-600">Free Tier Available</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">
          Get a comprehensive AI-powered analysis of your political personality
          based on all your quiz answers. All users receive detailed analysis of
          their complete responses with the same quality and depth.
        </p>

        {!summary && !loading && (
          <div className="text-center py-4">
            <button
              onClick={generateSummary}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 mr-3"
            >
              Generate Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <FaSpinner className="text-purple-600 text-3xl mx-auto mb-3 animate-spin" />
            <p className="text-gray-600">AI is analyzing your personality...</p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={generateSummary}
              className="text-red-600 text-sm underline mt-2 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaLightbulb className="text-purple-600 text-lg mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Your Personality Summary
                  </h4>
                  <div
                    className={`text-gray-700 leading-relaxed ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {summary}
                  </div>
                  {summary.length > 400 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-purple-600 text-sm font-medium mt-2 hover:text-purple-800"
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
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <FaBrain className="text-blue-600 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            AI Personality Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Comprehensive analysis with PhilosiQ+
          </p>
        </div>
      </div>

      {!summary && !loading && (
        <div className="text-center py-8">
          <FaLightbulb className="text-gray-400 text-4xl mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            Get a comprehensive AI-powered analysis of your political
            personality based on all your quiz answers. All users receive
            detailed analysis with the same quality and depth.
          </p>
          <button
            onClick={generateSummary}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Generate Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <FaSpinner className="text-blue-600 text-3xl mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">AI is analyzing your personality...</p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={generateSummary}
            className="text-red-600 text-sm underline mt-2 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaBrain className="text-blue-600 text-lg mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">
                  Your Comprehensive Personality Analysis
                </h4>
                <div
                  className={`text-gray-700 leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {summary}
                </div>
                {summary && summary.length > 400 && (
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

export default AIPersonalitySummary;
