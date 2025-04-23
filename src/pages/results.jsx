import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaDownload,
  FaEnvelope,
  FaArrowRight,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaBug,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ResultsProcessor from "../components/ResultsProcessor";
import AxisGraph from "../components/AxisGraph";
import DebugResultsTable from "../components/DebugResultsTable";

export default function ResultsPage() {
  return (
    <Layout title="Your Results - PhilosiQ">
      <ResultsProcessor>
        <ResultsContent />
      </ResultsProcessor>
    </Layout>
  );
}

// Separated content component to receive processed results as props
function ResultsContent({ results }) {
  console.log("ResultsContent component rendered", results);

  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [axisLetters, setAxisLetters] = useState({});
  const [secondaryArchetypes, setSecondaryArchetypes] = useState([]);

  // Get the raw data from session storage for debugging
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("quizResults");
      if (storedData) {
        setRawData(JSON.parse(storedData));
      }
    } catch (err) {
      console.error("Error loading raw quiz data:", err);
    }
  }, []);

  // Function to handle the letter determined by each axis
  const handleLetterDetermined = (axisName, letter) => {
    setAxisLetters((prev) => ({
      ...prev,
      [axisName]: letter,
    }));
  };

  // Log the axis letters when they change and calculate secondary archetypes
  useEffect(() => {
    if (Object.keys(axisLetters).length > 0) {
      console.log("Axis Letters:", axisLetters);

      // If we have all 5 axis letters, form the code and calculate secondary archetypes
      if (Object.keys(axisLetters).length >= 5) {
        const axisOrder = [
          "Equity vs. Free Market",
          "Libertarian vs. Authoritarian",
          "Progressive vs. Conservative",
          "Secular vs. Religious",
          "Globalism vs. Nationalism",
        ];

        const archetypeCode = axisOrder
          .map((axis) => axisLetters[axis] || "?")
          .join("");

        console.log("Archetype Code:", archetypeCode);

        // Calculate secondary archetypes
        calculateSecondaryArchetypes(axisLetters, axisOrder);
      }
    }
  }, [axisLetters]);

  // Calculate secondary archetypes based on primary archetype letters
  const calculateSecondaryArchetypes = (letters, axisOrder) => {
    if (!letters || Object.keys(letters).length < 5) return;

    // Define opposite letters for each axis
    const oppositeLetters = {
      E: "F",
      F: "E", // Equity vs. Free Market
      L: "A",
      A: "L", // Libertarian vs. Authoritarian
      P: "C",
      C: "P", // Progressive vs. Conservative
      S: "R",
      R: "S", // Secular vs. Religious
      G: "N",
      N: "G", // Globalism vs. Nationalism
    };

    // Get axis percentages to find which is closest to 50%
    const axisPercentages = {};
    results?.axisResults.forEach((axis) => {
      const canonicalName =
        axis.name === "Equality vs. Markets"
          ? "Equity vs. Free Market"
          : axis.name;
      axisPercentages[canonicalName] = Math.abs(axis.score - 50);
    });

    // Sort axes by how close they are to 50%
    const sortedAxes = [...axisOrder].sort((a, b) => {
      return (axisPercentages[a] || 0) - (axisPercentages[b] || 0);
    });

    // Get the closest 2 axes to 50%
    const closestAxes = sortedAxes.slice(0, 2);

    // Create secondary archetypes by flipping the letter of the axes closest to 50%
    const secondaries = [];

    closestAxes.forEach((axisToFlip) => {
      // Create a copy of the original letters
      const newLetters = { ...letters };

      // Flip the letter for the axis closest to 50%
      if (newLetters[axisToFlip]) {
        newLetters[axisToFlip] =
          oppositeLetters[newLetters[axisToFlip]] || newLetters[axisToFlip];
      }

      // Generate the code for this secondary archetype
      const secondaryCode = axisOrder
        .map((axis) => newLetters[axis] || "?")
        .join("");

      // Get the name from the archetype map
      const archetypeMap = {
        ELPSG: "The Utopian",
        ELPSN: "The Reformer",
        ELPRG: "The Prophet",
        ELPRN: "The Firebrand",
        ELCSG: "The Philosopher",
        ELCSN: "The Localist",
        ELCRG: "The Missionary",
        ELCRN: "The Guardian",
        EAPSG: "The Technocrat",
        EAPSN: "The Enforcer",
        EAPRG: "The Zealot",
        EAPRN: "The Purist",
        EACSG: "The Commander",
        EACSN: "The Steward",
        EACRG: "The Shepherd",
        EACRN: "The High Priest",
        FLPSG: "The Futurist",
        FLPSN: "The Maverick",
        FLPRG: "The Evangelist",
        FLPRN: "The Dissident",
        FLCSG: "The Globalist",
        FLCSN: "The Patriot",
        FLCRG: "The Traditionalist",
        FLCRN: "The Conservator",
        FAPSG: "The Overlord",
        FAPSN: "The Corporatist",
        FAPRG: "The Moralizer",
        FAPRN: "The Builder",
        FACSG: "The Executive",
        FACSN: "The Iconoclast",
        FACRG: "The Authoritarian",
        FACRN: "The Crusader",
      };

      // Calculate match percentage (just estimating based on how many letters were changed)
      const matchPercent = 90 - 15 * closestAxes.indexOf(axisToFlip);

      // Get traits based on the secondary archetype letters
      const traits = axisOrder.map((axis) => {
        let label = "";
        const letter = newLetters[axis];

        switch (axis) {
          case "Equity vs. Free Market":
            return letter === "E" ? "Equity" : "Free Market";
          case "Libertarian vs. Authoritarian":
            return letter === "L" ? "Libertarian" : "Authoritarian";
          case "Progressive vs. Conservative":
            return letter === "P" ? "Progressive" : "Conservative";
          case "Secular vs. Religious":
            return letter === "S" ? "Secular" : "Religious";
          case "Globalism vs. Nationalism":
            return letter === "G" ? "Globalism" : "Nationalism";
          default:
            return letter;
        }
      });

      // Create the secondary archetype object
      secondaries.push({
        name: archetypeMap[secondaryCode] || "Alternative Archetype",
        code: secondaryCode,
        match: `${matchPercent}% match`,
        traits: traits,
        flippedAxis: axisToFlip,
        slug: (archetypeMap[secondaryCode] || "alternative")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, ""),
      });
    });

    setSecondaryArchetypes(secondaries);
  };

  // Get the user's archetype information from results
  const archetype = results
    ? {
        id: results.archetype?.code?.toLowerCase() || "unknown",
        name: results.archetype?.name || "Unknown Archetype",
        description: getArchetypeDescription(results.archetype?.name),
        traits: getAllAxisTraits(results.axisResults),
        color: getArchetypeColor(results.archetype?.name),
      }
    : null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send an API request to email the results
    console.log(`Sending results to ${userEmail}`);

    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
    alert("PDF download functionality would be implemented here");
  };

  // If no results are passed, the ResultsProcessor component will handle it
  if (!results) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
      <div className="container-custom">
        {/* Logo for PDF sharing */}
        <div className="absolute top-28 right-8 opacity-70">
          <img src="/whitelogo.png" alt="PhilosiQ" className="h-10 w-auto" />
        </div>

        {/* Main Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Quiz Results</h1>
          <p className="text-lg text-gray-600">
            Based on your responses, we've identified your political archetype
          </p>
        </div>

        {/* Primary Archetype Card */}
        <div className="mb-16">
          <div
            className={`bg-gradient-to-r ${archetype.color} rounded-lg shadow-xl overflow-hidden`}
          >
            <div className="p-8 text-white text-center">
              <h2 className="text-5xl font-bold mb-4">{archetype.name}</h2>

              {/* Display the axis letters badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {Object.keys(axisLetters).length > 0
                  ? Object.entries(axisLetters).map(([axis, letter]) => {
                      // Determine the label based on the letter
                      let label = "";
                      switch (axis) {
                        case "Equity vs. Free Market":
                          label = letter === "E" ? "Equity" : "Free Market";
                          break;
                        case "Libertarian vs. Authoritarian":
                          label =
                            letter === "L" ? "Libertarian" : "Authoritarian";
                          break;
                        case "Progressive vs. Conservative":
                          label =
                            letter === "P" ? "Progressive" : "Conservative";
                          break;
                        case "Secular vs. Religious":
                          label = letter === "S" ? "Secular" : "Religious";
                          break;
                        case "Globalism vs. Nationalism":
                          label = letter === "G" ? "Globalism" : "Nationalism";
                          break;
                        default:
                          label = letter;
                      }

                      return (
                        <span
                          key={axis}
                          className="bg-white/20 px-4 py-1 rounded-full text-sm"
                        >
                          {label}
                        </span>
                      );
                    })
                  : // Fall back to the original traits if axis letters not yet available
                    archetype.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="bg-white/20 px-4 py-1 rounded-full text-sm"
                      >
                        {trait}
                      </span>
                    ))}
              </div>
              <p className="text-xl max-w-3xl mx-auto">
                {archetype.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-6 text-center">
            <Link
              href={`/archetypes/${archetype.id}`}
              className="btn-primary inline-flex items-center"
            >
              Learn More About Your Archetype <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Axis Breakdown */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Your Political Axis Breakdown
          </h2>
          <p className="text-center text-gray-600 mb-8">
            See where you stand on each political dimension
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* 
              Display the axis results using our AxisGraph component
              Note: "Progressive vs. Conservative" and "Libertarian vs. Authoritarian" axes
              are filtered out in the resultsCalculator.js file
            */}
            {results.axisResults.map((axis, index) => {
              // Only log a summary of which axes are being displayed
              if (index === 0) {
                console.log(
                  `Displaying ${results.axisResults.length} axes in results chart:`,
                  results.axisResults.map((a) => a)
                );
              }

              // Additional debug for the Equity axis
              if (
                axis.name === "Equity vs. Free Market" ||
                axis.name === "Equality vs. Markets"
              ) {
                console.log(`Results page - ${axis.name} data:`, {
                  rawScore: axis.rawScore,
                  score: axis.score,
                  userPosition: axis.userPosition,
                  positionStrength: axis.positionStrength,
                  leftLabel: axis.leftLabel,
                  rightLabel: axis.rightLabel,
                });
              }

              return (
                <AxisGraph
                  key={index}
                  name={axis.name}
                  score={axis.score}
                  questions={rawData?.questions}
                  answers={rawData?.answers}
                  rawScore={axis.rawScore}
                  leftLabel={axis.leftLabel}
                  rightLabel={axis.rightLabel}
                  userPosition={axis.userPosition}
                  positionStrength={axis.positionStrength}
                  onLetterDetermined={handleLetterDetermined}
                  className={
                    index < results.axisResults.length - 1
                      ? "border-b border-gray-200 pb-6"
                      : ""
                  }
                />
              );
            })}
          </div>
        </div>

        {/* Secondary Archetypes - Improved Design */}
        {secondaryArchetypes.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Your Secondary Archetypes
            </h2>
            <p className="text-center text-gray-600 mb-8">
              You also show strong alignment with these political archetypes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryArchetypes.map((archetype, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-secondary-darkBlue">
                        {archetype.name}
                      </h3>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {archetype.match}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {archetype.traits.map((trait, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">
                        Difference from primary:
                      </span>{" "}
                      Flipped position on{" "}
                      {archetype.flippedAxis.replace(" vs. ", "/")}
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      {getArchetypeDescription(archetype.name)}
                    </div>

                    <Link
                      href={`/archetypes/${archetype.slug}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center text-sm font-medium"
                    >
                      View Details <FaArrowRight className="ml-1 text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Section */}
        {rawData && (
          <div className="mb-16">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-center font-medium text-gray-700"
            >
              <FaBug className="mr-2" />
              {showDebug ? "Hide" : "Show"} Debug Information
              {showDebug ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>

            {showDebug && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-6 md:p-8">
                <DebugResultsTable
                  questions={rawData.questions}
                  answers={rawData.answers}
                  results={results}
                />
              </div>
            )}
          </div>
        )}

        {/* Share Results */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Share Your Results
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Results */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaEnvelope className="mr-2 text-primary-maroon" /> Email
                  Results
                </h3>
                {emailSent ? (
                  <div className="text-green-600">
                    <p className="mb-2">Results sent!</p>
                    <p className="text-sm">
                      Check your inbox for your PhilosiQ results.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary-outline"
                    >
                      Send Results
                    </button>
                  </form>
                )}
              </div>

              {/* Download PDF */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaDownload className="mr-2 text-primary-maroon" /> Download
                  Results
                </h3>
                <p className="mb-4 text-sm">
                  Save your results as a PDF to reference later or share with
                  others.
                </p>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full btn-primary-outline"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold mb-4">Share on Social Media</h3>
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaTwitter size={20} />
                </button>
                <button className="p-3 bg-[#4267B2] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaFacebook size={20} />
                </button>
                <button className="p-3 bg-[#0077B5] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaLinkedin size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Take Quiz Again Button */}
        <div className="text-center">
          <Link href="/quiz" className="btn-secondary inline-flex items-center">
            Take Quiz Again <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to extract all traits from axis results
function getAllAxisTraits(axisResults) {
  if (!axisResults || !Array.isArray(axisResults)) return [];

  return axisResults.map((axis) => {
    // FIXED: Return the OPPOSITE trait to match the archetype code
    // This is needed because we're using the opposite position for display
    const axisName = axis.name;
    const userPosition = axis.userPosition;

    // Define opposite positions for each axis
    const oppositePositions = {
      // For "Equity vs. Free Market" axis
      Equity: "Free Market",
      "Free Market": "Equity",
      // For "Libertarian vs. Authoritarian" axis
      Libertarian: "Authoritarian",
      Authoritarian: "Libertarian",
      // For "Progressive vs. Conservative" axis
      Progressive: "Conservative",
      Conservative: "Progressive",
      // For "Secular vs. Religious" axis
      Secular: "Religious",
      Religious: "Secular",
      // For "Globalism vs. Nationalism" axis
      Globalism: "Nationalism",
      Nationalism: "Globalism",
      // Handle centered positions
      Centered: "Centered",
    };

    // Use raw score to determine which side the user is actually on
    // This aligns with the archetype code that's calculated
    const rawScore = axis.rawScore;

    // Return the opposite of what was calculated
    // If rawScore is negative, we should show the right label
    // If rawScore is positive, we should show the left label
    if (rawScore < 0) {
      return axis.rightLabel;
    } else if (rawScore > 0) {
      return axis.leftLabel;
    } else {
      return "Centered"; // For scores exactly at 0
    }
  });
}

// Helper function to get a description for the archetype
function getArchetypeDescription(archetypeName) {
  const descriptions = {
    "The Patriot":
      "You believe in economic freedom within a framework of national identity and democratic values while leaning conservative.",
    "The Maverick":
      "You value individual liberty and free markets, combined with a secular approach and strong national identity.",
    "The Steward":
      "You prioritize traditional values and market economics, with a balanced approach to authority and national sovereignty.",
    // Add more descriptions as needed
    "Unknown Archetype":
      "Your unique combination of political values doesn't fit neatly into our defined archetypes.",
  };

  return descriptions[archetypeName] || descriptions["Unknown Archetype"];
}

// Helper function to get appropriate color gradient for the archetype
function getArchetypeColor(archetypeName) {
  const colors = {
    "The Patriot": "from-red-500 to-blue-400",
    "The Maverick": "from-blue-500 to-purple-400",
    "The Steward": "from-green-500 to-blue-400",
    // Add more colors as needed
    "Unknown Archetype": "from-gray-500 to-gray-400",
  };

  return colors[archetypeName] || colors["Unknown Archetype"];
}
