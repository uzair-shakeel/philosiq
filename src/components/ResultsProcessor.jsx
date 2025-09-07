import React, { useState, useEffect } from "react";
import { calculateResults } from "../utils/resultsCalculator";

/**
 * Component that processes quiz results from session storage
 * and provides the calculated results to its children
 */
export default function ResultsProcessor({ children }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch and process results when component mounts
    processResults();
  }, []);

  const processResults = async () => {
    try {
      setLoading(true);

      // Try to get stored quiz data from session storage first (for current session)
      let storedData = sessionStorage.getItem("quizResults");

      // If not found in sessionStorage, try localStorage (persisted from previous sessions)
      if (!storedData) {
        storedData = localStorage.getItem("quizResults");
      }

      if (!storedData) {
        setError("No quiz results found. Please take the quiz first.");
        setLoading(false);
        return;
      }

      // Parse the stored data
      const parsedData = JSON.parse(storedData);

      const { answers, questions, axisScores } = parsedData;

      if (!questions || !answers || !Array.isArray(questions) || Object.keys(answers).length === 0) {
        console.error("Invalid quiz results data structure:", { questions: !!questions, answers: !!answers, questionsArray: Array.isArray(questions), answersKeys: answers ? Object.keys(answers).length : 0 });
        setError("Invalid quiz results data. Please retake the quiz.");
        setLoading(false);
        return;
      }

      // Debug the questions to look for potential axis naming issues
      const axisNames = questions.map((q) => q.axis);
      const uniqueAxes = [...new Set(axisNames)];

      // Count questions per axis to ensure we have equity questions
      const axisCount = {};
      axisNames.forEach((axis) => {
        axisCount[axis] = (axisCount[axis] || 0) + 1;
      });

      // Check for Equity vs. Free Market or Equality vs. Markets questions specifically
      const equityQuestions = questions.filter(
        (q) =>
          q.axis === "Equity vs. Free Market" ||
          q.axis === "Equality vs. Markets"
      );

      // Calculate the results using our utility function
      const calculatedResults = calculateResults(questions, answers);

      // Save results to localStorage for persistence across browser sessions
      const completeResultsData = {
        answers,
        questions,
        axisScores,
        timestamp: new Date().toISOString(),
        archetype: calculatedResults.archetype,
        axisResults: calculatedResults.axisResults,
        quizType: parsedData.quizType || "full",
        isSaved: true,
        // Ensure we preserve any additional data from the original
        ...parsedData,
        // But override with our calculated results
        calculatedResults,
      };

      localStorage.setItem("quizResults", JSON.stringify(completeResultsData));
      
      // Also update sessionStorage to keep them in sync
      sessionStorage.setItem("quizResults", JSON.stringify(completeResultsData));

      // Check if we have equity results
      const hasEquityResults = calculatedResults.axisResults.some(
        (axis) => axis.name === "Equity vs. Free Market"
      );

      if (!hasEquityResults) {
        console.error(
          "Equity vs. Free Market axis is missing from calculated results"
        );

        // Try to add it manually if we can determine the values
        if (equityQuestions.length > 0) {
          calculatedResults.axisResults.unshift({
            name: "Equity vs. Free Market",
            score: 50,
            rawScore: 0,
            userPosition: "Centered",
            positionStrength: "Weak",
            leftLabel: "Equity",
            rightLabel: "Free Market",
            letter: "E", // Default to Equity (left side)
          });
        }
      }

      // Set the processed results along with original data
      setResults({
        ...calculatedResults,
        originalAnswers: answers,
        originalQuestions: questions,
        // Ensure we always have the raw data available for components
        questions: questions,
        answers: answers,
      });
    } catch (err) {
      console.error("Error processing results:", err);
      setError(`Failed to process quiz results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Processing Results</h2>
        <p className="text-gray-600">
          Please wait while we calculate your results...
        </p>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-lg">
          <h2 className="font-bold text-xl mb-2">Error</h2>
          <p>{error}</p>
          <a href="/quiz" className="btn-primary mt-4 inline-block">
            Take Quiz Again
          </a>
        </div>
      </div>
    );
  }

  // If no results yet, show a message
  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No results available. Please take the quiz first.
        </p>
        <a href="/quiz" className="btn-primary mt-4 inline-block">
          Take Quiz
        </a>
      </div>
    );
  }

  // Render the children with the results passed as props
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, { results });
  });
}
