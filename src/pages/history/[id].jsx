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
} from "react-icons/fa";
import AxisGraph from "../../components/AxisGraph";
import { jsPDF } from "jspdf";

export default function QuizResultDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchQuizResult = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
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

    fetchQuizResult();
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
                      leftSideColor = "bg-blue-500"; // Blue for Libertarian
                      rightSideColor = "bg-orange-500"; // Orange for Authoritarian
                      break;
                    case "Progressive vs. Conservative":
                      leftSideColor = "bg-green-500"; // Green for Progressive
                      rightSideColor = "bg-blue-400"; // Blue for Conservative
                      break;
                    case "Secular vs. Religious":
                      leftSideColor = "bg-yellow-400"; // Yellow for Secular
                      rightSideColor = "bg-purple-500"; // Purple for Religious
                      break;
                    case "Globalism vs. Nationalism":
                      leftSideColor = "bg-teal-500"; // Teal for Globalism
                      rightSideColor = "bg-green-500"; // Green for Nationalism
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
                          <span className="px-2 py-0.5 rounded-full text-white bg-blue-600">
                            {axis.leftLabel}{" "}
                            {axis.userPosition === axis.leftLabel &&
                              `(${axis.positionStrength})`}
                          </span>
                        </div>
                        <div className="text-xs font-medium">
                          <span className="px-2 py-0.5 rounded-full text-white bg-green-600">
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
                            {axis.leftPercent || axis.score}%
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
                            {axis.rightPercent || 100 - axis.score}%
                          </span>
                        </div>

                        {/* Marker for user's position */}
                        <div
                          className="absolute top-0 bottom-0 w-1 h-full bg-white border border-black z-30 transform -translate-x-1/2"
                          style={{ left: `${axis.score}%` }}
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

          {/* Download PDF Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
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
          </div>

          {/* Debug Section - Toggle this with a button */}
          <div className="mt-12 border-t pt-6">
            <button
              onClick={() => setShowDebug((prev) => !prev)}
              className="text-gray-500 underline mb-4"
            >
              {showDebug ? "Hide Debug Info" : "Show Debug Info"}
            </button>

            {showDebug && (
              <div className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                <h3 className="font-bold mb-2">Result Data Structure:</h3>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
