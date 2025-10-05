import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FaDownload,
  FaArrowLeft,
  FaSpinner,
  FaExclamationCircle,
  FaCalendarAlt,
  FaChartPie,
  FaBolt,
  FaBalanceScale,
  FaThumbsUp,
  FaThumbsDown,
  FaInfoCircle,
  FaEnvelope,
  FaCrown,
  FaBrain,
  FaLightbulb,
} from "react-icons/fa";
import AxisGraph from "../../components/AxisGraph";
import { jsPDF } from "jspdf";
import { FaKey } from "react-icons/fa";
import AxisSpecificSummaries from "../../components/AxisSpecificSummaries";
import PoliticalCompass from "../../components/PoliticalCompass";

// Helper function to convert answer value to agreement text
const getAgreementText = (answerValue) => {
  if (answerValue === 2) return "Strongly Agree";
  if (answerValue === 1) return "Agree";
  if (answerValue === 0) return "Neutral";
  if (answerValue === -1) return "Disagree";
  if (answerValue === -2) return "Strongly Disagree";
  return answerValue;
};

// Local component to render a collapsible AI summary block
function SummaryBlock({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const limit = 500;
  const needsToggle = text.length > limit;
  const shown = expanded || !needsToggle ? text : text.slice(0, limit) + "...";
  return (
    <div>
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {shown}
      </div>
      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-purple-600 text-sm font-medium hover:text-purple-800"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

// Visual theme per axis for the Impact Answers section (matching results page)
const AXIS_THEME = {
  "Equity vs. Free Market": {
    header: "from-blue-500 to-green-500",
    aligned: "bg-emerald-50 text-emerald-700 border-emerald-200",
    against: "bg-rose-50 text-rose-700 border-rose-200",
  },
  "Libertarian vs. Authoritarian": {
    header: "from-teal-500 to-orange-500",
    aligned: "bg-teal-50 text-teal-700 border-teal-200",
    against: "bg-orange-50 text-orange-700 border-orange-200",
  },
  "Progressive vs. Conservative": {
    header: "from-sky-500 to-red-500",
    aligned: "bg-sky-50 text-sky-700 border-sky-200",
    against: "bg-red-50 text-red-700 border-red-200",
  },
  "Secular vs. Religious": {
    header: "from-yellow-500 to-purple-500",
    aligned: "bg-yellow-50 text-yellow-700 border-yellow-200",
    against: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "Globalism vs. Nationalism": {
    header: "from-lime-500 to-rose-500",
    aligned: "bg-lime-50 text-lime-700 border-lime-200",
    against: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function QuizResultDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [genCodeLoading, setGenCodeLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchQuizResult = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          // Store current URL for return after login
          if (typeof window !== "undefined") {
            const currentUrl =
              window.location.pathname + window.location.search;
            localStorage.setItem("returnUrl", currentUrl);
          }
          router.push("/login?redirect=history");
          return;
        }

        const response = await fetch(`/api/quiz/result/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch result: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.result) {
          console.log("Received result data:", data.result);
          console.log("Secondary archetypes:", data.result.secondaryArchetypes);
          console.log("Axis breakdown:", data.result.axisBreakdown);
          console.log("Impact answers:", data.result.impactAnswers);
          console.log("Has impact answers:", !!data.result.impactAnswers);
          setResult(data.result);
        } else {
          setError("Could not find this quiz result.");
        }
      } catch (error) {
        console.error("Error fetching quiz result:", error);
        setError("Failed to load quiz result. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const checkPlusStatus = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const response = await fetch(
            `/api/user/plus-status?email=${encodeURIComponent(email)}`
          );
          if (response.ok) {
            const data = await response.json();
            setIsPlusActive(!!data?.active);
          }
        }
      } catch (error) {
        console.error("Error checking plus status:", error);
      }
    };

    fetchQuizResult();
    checkPlusStatus();
  }, [id, router]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsPdfGenerating(true);

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Set initial position
      let y = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;

      // Helper function to add text with word wrap
      const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + lines.length * lineHeight;
      };

      // Helper function to add a separator
      const addSeparator = (y) => {
        return y + 20;
      };

      // Add title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("PhilosiQ Political Archetype Results", margin, y);
      y += 20;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on ${formatDate(result.createdAt)}`, margin, y);
      y = addSeparator(y + 10);

      // Add primary archetype
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      y += 10;
      pdf.text(
        `Your Archetype: ${result.archetype?.name || "Unknown"}`,
        margin,
        y
      );
      y += 20;

      // Add traits
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const traits = result.archetype?.traits || [];
      pdf.text(`Traits: ${traits.join(", ")}`, margin, y);
      y += 15;

      // Add axis breakdown section
      y += 10;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Political Axis Breakdown", margin, y);
      y += 20;

      // Add each axis
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      if (result.axisBreakdown && result.axisBreakdown.length > 0) {
        result.axisBreakdown.forEach((axis, index) => {
          // Check if we need to add a new page
          if (y > pdf.internal.pageSize.getHeight() - 80) {
            pdf.addPage();
            y = 40;
          }

          pdf.setFont("helvetica", "bold");
          pdf.text(axis.name, margin, y);
          y += 15;

          pdf.setFont("helvetica", "normal");

          // Simple text representation of the axis position
          const leftPercent =
            axis.leftPercent ||
            (axis.score <= 50 ? axis.score : 100 - axis.score);
          const rightPercent =
            axis.rightPercent ||
            (axis.score >= 50 ? axis.score : 100 - axis.score);

          pdf.text(`${axis.leftLabel}: ${leftPercent}%`, margin, y);
          y += 15;
          pdf.text(`${axis.rightLabel}: ${rightPercent}%`, margin, y);
          y += 15;

          // Add a simple text indicator of position
          pdf.text(
            `Position: ${axis.userPosition} (${axis.positionStrength})`,
            margin,
            y
          );
          y += 20;

          if (index < result.axisBreakdown.length - 1) {
            y = addSeparator(y);
          }
        });
      }

      // Add secondary archetypes if they exist
      if (result.secondaryArchetypes && result.secondaryArchetypes.length > 0) {
        // Check if we need to add a new page
        if (y > pdf.internal.pageSize.getHeight() - 120) {
          pdf.addPage();
          y = 40;
        }

        y = addSeparator(y);
        y += 10;

        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Your Secondary Archetypes", margin, y);
        y += 20;

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          "You also show strong alignment with these political archetypes:",
          margin,
          y
        );
        y += 20;

        result.secondaryArchetypes.forEach((archetype, index) => {
          // Check if we need to add a new page
          if (y > pdf.internal.pageSize.getHeight() - 150) {
            pdf.addPage();
            y = 40;
          }

          pdf.setFont("helvetica", "bold");
          pdf.text(`${archetype.name} (${archetype.match})`, margin, y);
          y += 15;

          pdf.setFont("helvetica", "normal");
          pdf.text(`Traits: ${(archetype.traits || []).join(", ")}`, margin, y);
          y += 15;

          pdf.text(
            `Difference from primary: Flipped position on ${
              archetype.flippedAxis
                ? archetype.flippedAxis.replace(" vs. ", "/")
                : ""
            }`,
            margin,
            y
          );
          y += 25;

          if (index < result.secondaryArchetypes.length - 1) {
            y = addSeparator(y);
          }
        });
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      const footerText =
        "Visit philosiq.com to learn more about your political archetype";
      pdf.text(
        footerText,
        pageWidth / 2,
        pdf.internal.pageSize.getHeight() - 30,
        { align: "center" }
      );

      // Generate a filename with the archetype name and date
      const archetypeName = result.archetype?.name || "Results";
      const date = new Date().toISOString().split("T")[0];
      const filename = `PhilosiQ-${archetypeName.replace(
        /\s+/g,
        "-"
      )}-${date}.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const copyIQryptCode = async () => {
    try {
      if (!generatedCode) return;
      if (navigator.clipboard && window.ClipboardItem) {
        const text = generatedCode;
        const html = `<span style=\"font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace\">${text}</span>`;
        const item = new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(generatedCode);
      }
      setCopiedCode(true);
    } catch (e) {
      alert("Failed to copy code");
    }
  };

  const handleGenerateIQrypt = async () => {
    if (!result?._id || genCodeLoading) return;
    try {
      setGenCodeLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Login required.");
      const resp = await fetch("/api/compare/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resultId: result._id }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.message || "Failed to generate code");
      setGeneratedCode(data.code);
    } catch (e) {
      alert(e.message || "Unable to generate code.");
    } finally {
      setGenCodeLoading(false);
    }
  };

  const handleDeleteResult = async () => {
    if (!result) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this quiz result? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to delete a result.");
        setIsDeleting(false);
        return;
      }
      const response = await fetch(`/api/quiz/result/${result._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Quiz result deleted successfully.");
        router.push("/history");
      } else {
        alert(data.message || "Failed to delete quiz result.");
      }
    } catch (error) {
      alert("Failed to delete quiz result. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Quiz Result - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
          <div className="container-custom">
            <div className="flex flex-col items-center justify-center py-16">
              <FaSpinner className="animate-spin text-4xl text-primary-maroon mb-4" />
              <p className="text-lg">Loading quiz result...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
          <div className="container-custom">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-start">
              <FaExclamationCircle className="text-xl mt-1 mr-3" />
              <div>
                <h2 className="text-xl font-bold mb-2">Error Loading Result</h2>
                <p className="mb-4">{error}</p>
                <Link
                  href="/history"
                  className="bg-red-600 text-white px-4 py-2 rounded-md inline-flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Back to History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout title="Quiz Result Not Found - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
          <div className="container-custom">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Result Not Found</h2>
              <p className="mb-4">
                The quiz result you're looking for could not be found.
              </p>
              <Link
                href="/history"
                className="bg-yellow-600 text-white px-4 py-2 rounded-md inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to History
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${result.archetype?.name || "Quiz Result"} - PhilosiQ`}>
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/history"
              className="inline-flex items-center text-primary-maroon hover:text-primary-darkMaroon"
            >
              <FaArrowLeft className="mr-2" /> Back to History
            </Link>
          </div>
          {/* Result Date */}
          <div className="flex items-center text-gray-600 mb-6">
            <FaCalendarAlt className="mr-2" />
            <span>Taken on {formatDate(result.createdAt)}</span>
            <span className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {result.quizType === "full" ? "Full Quiz" : "Short Quiz"}
            </span>
          </div>
          {/* Primary Archetype Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="p-8 text-center relative">
                {/* Top decorative elements */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full opacity-30 translate-x-1/2 -translate-y-1/3"></div>

                <h2 className="text-5xl font-bold mb-4 text-gray-800 relative">
                  {result.archetype?.name || "Unknown Archetype"}
                </h2>

                {/* Display the traits badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {result.archetype?.traits?.map((trait, index) => {
                    // Determine color based on trait
                    let bgColor = "bg-gray-200";

                    if (trait === "Equity")
                      bgColor = "bg-blue-600 text-white";
                    else if (trait === "Free Market")
                      bgColor = "bg-green-600 text-white";
                    else if (trait === "Libertarian")
                      bgColor = "bg-teal-500 text-white";
                    else if (trait === "Authoritarian")
                      bgColor = "bg-orange-500 text-white";
                    else if (trait === "Progressive")
                      bgColor = "bg-sky-500 text-white";
                    else if (trait === "Conservative")
                      bgColor = "bg-red-400 text-white";
                    else if (trait === "Secular")
                      bgColor = "bg-yellow-400 text-white";
                    else if (trait === "Religious")
                      bgColor = "bg-purple-500 text-white";
                    else if (trait === "Globalism")
                      bgColor = "bg-lime-500 text-white";
                    else if (trait === "Nationalism")
                      bgColor = "bg-rose-500 text-white";

                    return (
                      <span
                        key={index}
                        className={`${bgColor} px-4 py-1 rounded-full text-sm`}
                      >
                        {trait}
                      </span>
                    );
                  })}
                </div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
              </div>
            </div>
          </div>

          {/* Axis Breakdown */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Political Axis Breakdown
            </h2>
            <p className="text-center text-gray-600 mb-8">
              See where you stood on each political dimension
            </p>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {result.axisBreakdown && result.axisBreakdown.length > 0 ? (
                result.axisBreakdown.map((axis, index) => {
                  // Determine colors based on axis name
                  let leftSideColor = "bg-blue-600";
                  let rightSideColor = "bg-green-600";
                  switch (axis.name) {
                    case "Equity vs. Free Market":
                      leftSideColor = "bg-blue-600"; // Blue for Equity
                      rightSideColor = "bg-green-600"; // Green for Free Market
                      break;
                    case "Libertarian vs. Authoritarian":
                      leftSideColor = "bg-teal-500"; // Blue for Libertarian
                      rightSideColor = "bg-orange-500"; // Orange for Authoritarian
                      break;
                    case "Progressive vs. Conservative":
                      leftSideColor = "bg-sky-500"; // Green for Progressive
                      rightSideColor = "bg-red-400"; // Blue for Conservative
                      break;
                    case "Secular vs. Religious":
                      leftSideColor = "bg-yellow-400"; // Yellow for Secular
                      rightSideColor = "bg-purple-500"; // Purple for Religious
                      break;
                    case "Globalism vs. Nationalism":
                      leftSideColor = "bg-lime-500"; // Teal for Globalism
                      rightSideColor = "bg-rose-500"; // Green for Nationalism
                      break;
                  }

                  return (
                    <div
                      key={index}
                      className={
                        index < result.axisBreakdown.length - 1
                          ? "mb-8 pb-8 border-b border-gray-200"
                          : ""
                      }
                    >
                      <h3 className="text-lg font-semibold mb-1">
                        {axis.name}
                      </h3>

                      {/* Axis Labels */}
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium">
                          <span
                            className={`px-2 py-0.5 rounded-full text-white ${leftSideColor}`}
                          >
                            {axis.leftLabel}{" "}
                            {axis.userPosition === axis.leftLabel &&
                              `(${axis.positionStrength})`}
                          </span>
                        </div>
                        <div className="text-xs font-medium">
                          <span
                            className={`px-2 py-0.5 rounded-full text-white ${rightSideColor}`}
                          >
                            {axis.rightLabel}{" "}
                            {axis.userPosition === axis.rightLabel &&
                              `(${axis.positionStrength})`}
                          </span>
                        </div>
                      </div>

                      {/* Axis bar */}
                      <div className="relative h-10 rounded-full overflow-hidden mt-1 border border-gray-200">
                        {/* Left side bar with percentage */}
                        <div
                          className={`h-full absolute left-0 z-10 flex items-center justify-center ${leftSideColor}`}
                          style={{
                            width: `${axis.leftPercent || axis.score}%`,
                          }}
                        >
                          <span className="text-white font-bold text-center px-2 z-20">
                            {(axis.leftPercent || axis.score).toFixed(2)}%
                          </span>
                        </div>

                        {/* Right side bar with percentage */}
                        <div
                          className={`h-full absolute right-0 z-10 flex items-center justify-center ${rightSideColor}`}
                          style={{
                            width: `${axis.rightPercent || 100 - axis.score}%`,
                          }}
                        >
                          <span className="text-white font-bold text-center px-2 z-20">
                            {(axis.rightPercent || 100 - axis.score).toFixed(2)}
                            %
                          </span>
                        </div>

                        {/* Marker for user's position */}
                        <div
                          className="absolute top-0 bottom-0 w-1 h-full bg-white  z-30 transform -translate-x-1/2"
                          style={{
                            left: `${axis.score}%`,
                          }}
                        ></div>
                      </div>

                      {/* Position description */}
                      <div className="mt-2 text-sm text-gray-700">
                        Your position: {axis.userPosition} (
                        {axis.positionStrength})
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaChartPie className="mx-auto text-4xl mb-3 opacity-30" />
                  <p>No axis breakdown data available for this result.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Personality Summary (General) */}
          {result.aiSummary && (
            <div className="mb-16">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaInfoCircle className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      AI Personality Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Saved with your result
                    </p>
                  </div>
                </div>

                <SummaryBlock text={result.aiSummary} />
              </div>
            </div>
          )}

          {/* Political Compass */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Political Compass
            </h2>
            <div className="max-w-2xl mx-auto">
              <PoliticalCompass
                axisResults={result.axisBreakdown}
                answers={result.answers}
                questions={result.questions}
              />
            </div>
          </div>

          {/* Axis-Specific AI Summaries - Philosiq+ Only */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <FaBrain className="text-blue-600" />
                Axis-Specific AI Analysis
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get detailed, personalized analysis for each political
                dimension. Each summary focuses specifically on your answers and
                positioning for that particular axis, providing deeper insights
                than general analysis.
              </p>

              {!isPlusActive && (
                <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-purple-700 text-sm">
                    <strong>Philosiq+ Exclusive:</strong> Unlock all 5 detailed
                    axis analyses to get comprehensive insights into your
                    political positioning.
                  </p>
                </div>
              )}
            </div>

            {isPlusActive &&
            result.axisSummaries &&
            Object.keys(result.axisSummaries).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(result.axisSummaries).map(
                  ([axisName, summary]) => (
                    <div
                      key={axisName}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                          <FaChartPie className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {axisName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            AI Analysis Complete
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <FaBrain className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 mb-2">
                                {axisName} Analysis
                              </h4>
                              <div className="text-gray-700 leading-relaxed text-sm">
                                {summary}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : isPlusActive ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  "Equity vs. Free Market",
                  "Libertarian vs. Authoritarian",
                  "Progressive vs. Conservative",
                  "Secular vs. Religious",
                  "Globalism vs. Nationalism",
                ].map((axisName) => (
                  <div
                    key={axisName}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                        <FaChartPie className="text-blue-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {axisName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Analysis not available
                        </p>
                      </div>
                    </div>

                    <div className="text-center py-6">
                      <FaLightbulb className="text-gray-400 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600 mb-4 text-sm">
                        This result was saved before axis summaries were
                        available
                      </p>
                      <p className="text-gray-500 text-xs">
                        Take a new quiz to get comprehensive analysis for this
                        dimension
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  "Equity vs. Free Market",
                  "Libertarian vs. Authoritarian",
                  "Progressive vs. Conservative",
                  "Secular vs. Religious",
                  "Globalism vs. Nationalism",
                ].map((axisName) => (
                  <div
                    key={axisName}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    {/* Lock indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
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
                        <h3 className="text-lg font-semibold text-gray-800">
                          {axisName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Locked for free users
                        </p>
                      </div>
                    </div>

                    <div className="text-center py-6">
                      <FaLightbulb className="text-gray-400 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600 mb-4 text-sm">
                        Generate a detailed analysis focused specifically on
                        your {axisName.toLowerCase()} positioning
                      </p>
                      <button
                        onClick={() => router.push("/profile")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm"
                      >
                        Upgrade to Unlock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Answers - The Balance Board */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2 text-center flex items-center justify-center gap-2">
              <FaBolt className="text-yellow-500" /> The Balance Board
            </h2>
            <p className="text-center text-gray-600 mb-8">
              The Balance Board is where your score's story comes to life. On
              one side are the answers that propelled you toward your result. On
              the other are the ones that pulled you back from the edge.
              Together, they show why you landed exactly where you did
            </p>

            {!result.impactAnswers ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-3 block">⚡</span>
                <p>No impact answers data available for this result.</p>
                <p className="text-sm mt-2">
                  This quiz result was taken before the Balance Board feature
                  was added.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Show only first axis for free users, all axes for plus users */}
                {result.axisBreakdown
                  ?.filter((_, index) => isPlusActive || index === 0)
                  ?.map((axis, index) => {
                    const data = result.impactAnswers[axis.name] || {
                      aligned: [],
                      against: [],
                    };
                    const theme = AXIS_THEME[axis.name] || {
                      header: "from-gray-200 to-gray-100",
                      aligned: "bg-green-50 text-green-700 border-green-200",
                      against: "bg-red-50 text-red-700 border-red-200",
                    };
                    const formatScore = (n) => {
                      const rounded = Math.round(n * 10) / 10;
                      return (rounded > 0 ? "+" : "") + rounded;
                    };
                    
                    // Calculate which side is dominant based on score (same logic as AxisGraph)
                    const leftPercent = axis.score || 50;
                    const rightPercent = 100 - leftPercent;
                    const isDominantLeft = leftPercent > rightPercent;
                    const dominantSide = isDominantLeft ? axis.leftLabel : axis.rightLabel;
                    const dominantPercent = isDominantLeft ? leftPercent : rightPercent;
                    
                    // Determine strength based on percentage
                    const getStrength = (percent) => {
                      if (percent >= 80) return "Very Strong";
                      if (percent >= 70) return "Strong";
                      if (percent >= 60) return "Moderate";
                      if (percent >= 55) return "Slight";
                      return "Weak";
                    };
                    const strengthLabel = getStrength(dominantPercent);
                    
                    return (
                      <div
                        key={axis.name}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                      >
                        <div
                          className={`px-6 py-4 bg-gradient-to-r ${theme.header} text-white flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-2">
                            <FaBalanceScale className="opacity-90" />
                            <h3 className="text-lg font-bold">{axis.name}</h3>
                          </div>
                          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            Your Result: {dominantSide}
                          </span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FaThumbsUp className="text-emerald-600" />
                              <h4 className="font-semibold">
                                Aligned with your view
                              </h4>
                            </div>
                            {data.aligned.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                No strong aligned answers.
                              </p>
                            ) : (
                              <ul className="space-y-3">
                                {data.aligned.map((item) => (
                                  <li
                                    key={item.id}
                                    className={`p-3 rounded-lg border ${theme.aligned} flex items-start justify-between`}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {item.question}
                                      </p>
                                      {item.answerValue !== undefined && (
                                        <p className="text-xs opacity-75 mt-1">
                                          Your Answer:{" "}
                                          {getAgreementText(item.answerValue)}
                                        </p>
                                      )}
                                    </div>
                                    <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/70 text-current border border-white">
                                      {formatScore(item.contribution)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FaThumbsDown className="text-rose-600" />
                              <h4 className="font-semibold">
                                Counter to your view
                              </h4>
                            </div>
                            {data.against.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                No strong counter answers.
                              </p>
                            ) : (
                              <ul className="space-y-3">
                                {data.against.map((item) => (
                                  <li
                                    key={item.id}
                                    className={`p-3 rounded-lg border ${theme.against} flex items-start justify-between`}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {item.question}
                                      </p>
                                      {item.answerValue !== undefined && (
                                        <p className="text-xs opacity-75 mt-1">
                                          Your Answer:{" "}
                                          {getAgreementText(item.answerValue)}
                                        </p>
                                      )}
                                    </div>
                                    <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/70 text-current border border-white">
                                      {formatScore(item.contribution)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Show upgrade prompt for free users after first axis */}
                {!isPlusActive &&
                  result.axisBreakdown &&
                  result.axisBreakdown.length > 1 && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <FaCrown className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            Unlock All Axes
                          </h3>
                          <p className="text-sm text-gray-600">
                            Upgrade to Philosiq+ to see your complete Balance
                            Board
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">
                        You're currently seeing only the first axis. Upgrade to
                        Philosiq+ to access all {result.axisBreakdown.length}{" "}
                        axes and get the full picture of what influenced your
                        political archetype.
                      </p>

                      <button
                        onClick={() => router.push("/profile")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
                      >
                        Upgrade to Philosiq+
                      </button>
                    </div>
                  )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              Impact score reflects how strongly an answer moved your result on
              that axis (sign shows direction).
            </p>
          </div>

          {/* Secondary Archetypes - If Available */}
          {result.secondaryArchetypes &&
            result.secondaryArchetypes.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Secondary Archetypes
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  You also showed strong alignment with these political
                  archetypes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {result.secondaryArchetypes.map((archetype, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 relative">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-full opacity-30 translate-x-1/3 -translate-y-1/3"></div>

                        <div className="flex justify-between items-center relative">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {archetype.name}
                          </h3>
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                            {archetype.match}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-2 mb-5">
                          {archetype.traits?.map((trait, i) => {
                            // Define colors for different traits
                            let bgColor = "bg-gray-200";

                            if (trait === "Equity")
                              bgColor = "bg-blue-100 text-blue-800";
                            else if (trait === "Free Market")
                              bgColor = "bg-green-100 text-green-800";
                            else if (trait === "Libertarian")
                              bgColor = "bg-indigo-100 text-indigo-800";
                            else if (trait === "Authoritarian")
                              bgColor = "bg-orange-100 text-orange-800";
                            else if (trait === "Progressive")
                              bgColor = "bg-purple-100 text-purple-800";
                            else if (trait === "Conservative")
                              bgColor = "bg-blue-100 text-blue-800";
                            else if (trait === "Secular")
                              bgColor = "bg-yellow-100 text-yellow-800";
                            else if (trait === "Religious")
                              bgColor = "bg-purple-100 text-purple-800";
                            else if (trait === "Globalism")
                              bgColor = "bg-teal-100 text-teal-800";
                            else if (trait === "Nationalism")
                              bgColor = "bg-red-100 text-red-800";

                            return (
                              <span
                                key={i}
                                className={`${bgColor} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}
                              >
                                {trait}
                              </span>
                            );
                          })}
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100 shadow-inner">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">
                              Difference from primary:
                            </span>{" "}
                            Flipped position on{" "}
                            <span className="font-semibold text-blue-700">
                              {archetype.flippedAxis?.replace(" vs. ", "/")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Download PDF Button */}
          <div className="text-center mt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating || isDeleting}
              className="bg-primary-maroon text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-primary-darkMaroon transition-colors disabled:bg-gray-400"
            >
              {isPdfGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Generating PDF...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" /> Download as PDF
                </>
              )}
            </button>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGenerateIQrypt}
                disabled={genCodeLoading}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 inline-flex items-center"
                title="Generate a shareable IQrypt Code to compare with others"
              >
                {genCodeLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Generating...
                  </>
                ) : (
                  <>
                    <FaKey className="mr-2" /> Generate IQrypt Code
                  </>
                )}
              </button>
              {generatedCode && (
                <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-full border border-gray-200">
                  <span className="font-mono">{generatedCode}</span>
                  <button
                    onClick={copyIQryptCode}
                    className="text-blue-600 hover:underline"
                    title="Copy code"
                  >
                    {copiedCode ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleDeleteResult}
              disabled={isDeleting || isPdfGenerating}
              className="bg-red-600 text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-red-800 transition-colors disabled:bg-gray-400"
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Deleting...
                </>
              ) : (
                <>
                  <FaExclamationCircle className="mr-2" /> Delete Result
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
