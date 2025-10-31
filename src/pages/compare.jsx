import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import AxisGraph from "../components/AxisGraph";
import { useRouter } from "next/router";
import {
  FaExchangeAlt,
  FaSearch,
  FaSpinner,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import SmallLoader from "../components/SmallLoader";

// Helper function to create styled pill components
const pill = (value) => {
  if (value === null || value === undefined) return null;

  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let borderColor = "border-gray-200";

  if (typeof value === "number") {
    if (value === 0) {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      borderColor = "border-green-200";
    } else if (Math.abs(value) === 1) {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      borderColor = "border-yellow-200";
    } else if (Math.abs(value) === 2) {
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      borderColor = "border-orange-200";
    } else {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      borderColor = "border-red-200";
    }
  }

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}
    >
      {value}
    </span>
  );
};

export default function ComparePage() {
  const router = useRouter();
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [history, setHistory] = useState([]);
  const [leftId, setLeftId] = useState("");
  const [rightCode, setRightCode] = useState("");
  const [leftResult, setLeftResult] = useState(null);
  const [rightResult, setRightResult] = useState(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          // Store current URL for return after login
          if (typeof window !== "undefined") {
            const currentUrl =
              window.location.pathname + window.location.search;
            localStorage.setItem("returnUrl", currentUrl);
          }
          return router.push("/login?redirect=compare");
        }
        let email = localStorage.getItem("userEmail");
        if (!email) {
          const r = await fetch("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (r.ok) {
            const u = await r.json();
            email = u?.email;
            if (email) localStorage.setItem("userEmail", email);
          }
        }
        setUserEmail(email || "");
        if (email) {
          const statusResp = await fetch(
            `/api/user/plus-status?email=${encodeURIComponent(email)}`
          );
          if (statusResp.ok) {
            const { active } = await statusResp.json();
            setIsPlusActive(!!active);
          }
        }
        // Load history for dropdown
        const histResp = await fetch("/api/quiz/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (histResp.ok) {
          const data = await histResp.json();
          if (data?.results) setHistory(data.results);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const loadLeft = async (id) => {
    try {
      setResolving(true);
      const token = localStorage.getItem("authToken");
      const resp = await fetch(`/api/quiz/result/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (!resp.ok || !data?.result) throw new Error(data?.message || "Failed");
      setLeftResult(data.result);
    } catch (e) {
      alert(e.message || "Failed to load your result");
    } finally {
      setResolving(false);
    }
  };

  const loadRight = async (code) => {
    try {
      setResolving(true);
      const resp = await fetch(
        `/api/compare/resolve?code=${encodeURIComponent(code)}`
      );
      const data = await resp.json();
      if (!resp.ok || !data?.result)
        throw new Error(data?.message || "Invalid code");
      setRightResult(data.result);
    } catch (e) {
      alert(e.message || "Failed to resolve code");
    } finally {
      setResolving(false);
    }
  };

  const compareAxes = useMemo(() => {
    if (!leftResult?.axisBreakdown || !rightResult?.axisBreakdown) return [];
    const byName = (arr) => Object.fromEntries(arr.map((a) => [a.name, a]));
    const left = byName(leftResult.axisBreakdown);
    const right = byName(rightResult.axisBreakdown);
    const names = Array.from(
      new Set([...Object.keys(left), ...Object.keys(right)])
    );
    return names.map((name) => {
      const a = left[name];
      const b = right[name];
      return {
        name,
        left: a ? a.score : null,
        right: b ? b.score : null,
        leftLabel: a?.leftLabel || b?.leftLabel,
        rightLabel: a?.rightLabel || b?.rightLabel,
      };
    });
  }, [leftResult, rightResult]);

  const compareQuestions = useMemo(() => {
    // Build per-question comparison when answerBreakdown is present
    const left = leftResult?.answerBreakdown || [];
    const right = rightResult?.answerBreakdown || [];
    if (!left.length && !right.length) return [];

    const mapById = (arr) =>
      Object.fromEntries(arr.map((x) => [x.questionId, x]));
    const L = mapById(left);
    const R = mapById(right);
    const ids = Array.from(new Set([...Object.keys(L), ...Object.keys(R)]));
    // Return merged rows with metadata if available
    const rows = ids.map((qid) => {
      const a = L[qid];
      const b = R[qid];

      // Calculate delta (difference between answers)
      let delta = null;
      if (
        a?.answer !== undefined &&
        a?.answer !== null &&
        b?.answer !== undefined &&
        b?.answer !== null
      ) {
        delta = a.answer - b.answer;
      }

      return {
        questionId: qid,
        axis: a?.axis || b?.axis,
        topic: a?.topic || b?.topic,
        question: a?.question || b?.question || "",
        left: a
          ? {
              answer: a.answer,
              contribution: a.contribution,
            }
          : null,
        right: b
          ? {
              answer: b.answer,
              contribution: b.contribution,
            }
          : null,
        delta: delta,
      };
    });
    // Sort by axis then by absolute delta contribution desc
    return rows.sort((r1, r2) => {
      const ax = (r1.axis || "").localeCompare(r2.axis || "");
      if (ax !== 0) return ax;
      const d1 = Math.abs(
        (r1.left?.contribution || 0) - (r1.right?.contribution || 0)
      );
      const d2 = Math.abs(
        (r2.left?.contribution || 0) - (r2.right?.contribution || 0)
      );
      return d2 - d1;
    });
  }, [leftResult, rightResult]);

  if (loading) {
    return (
      <Layout title="Compare - Philosiq">
        <SmallLoader />
      </Layout>
    );
  }

  if (!isPlusActive) {
    return (
      <Layout title="Compare - Philosiq">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            <FaUsers className="mx-auto text-4xl text-gray-400 mb-3" />
            <h1 className="text-2xl font-bold mb-2">Philosiq+ Required</h1>
            <p className="text-gray-600 mb-4">
              The Compare feature is available to Philosiq+ subscribers.
            </p>
            <button
              onClick={() => router.push("/results")}
              className="px-5 py-2 bg-primary-maroon text-white rounded-full"
            >
              Upgrade
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Compare - Philosiq">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:pt-40 sm:pb-16">
          <header className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              Compare Your Results
            </h1>
            <p className="text-sm sm:text-base text-gray-600 sm:mt-0">
              See how your political views compare with others
            </p>
          </header>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>
              Click{" "}
              <a
                  href="/profile"
                  className="font-semibold text-blue-800 hover:underline"
                >
                  Profile
                </a>{" "}
                in the top-right corner.
              </li>
              <li>
                Select{" "}
                <a
                  href="/history"
                  className="font-semibold text-blue-800 hover:underline"
                >
                  Quiz History
                </a>
                .
              </li>
              <li>
                Find the quiz you’d like to compare and click{" "}
                <span className="font-semibold">View Full Results</span>.
              </li>
              <li>
                Scroll to the bottom of the page and click{" "}
                <span className="font-semibold">Generate IQrypt Code</span>.
              </li>
              <li>Copy the generated code.</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Saved Quiz
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
                  value={leftId}
                  onChange={(e) => setLeftId(e.target.value)}
                >
                  <option value="">Select a quiz</option>
                  {history.map((h) => (
                    <option key={h._id} value={h._id}>
                      {new Date(h.createdAt).toLocaleString()} -{" "}
                      {h.archetype?.name || "Unknown"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Friend's IQrypt Code
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-sm sm:text-base"
                  placeholder="Paste code here"
                  value={rightCode}
                  onChange={(e) => setRightCode(e.target.value.trim())}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={async () => {
                  if (!leftId || !rightCode) return;
                  await Promise.all([
                    loadLeft(leftId),
                    loadRight(rightCode)
                  ]);
                }}
                className="px-4 py-2 bg-primary-maroon text-white rounded-lg text-sm sm:text-base w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!leftId || !rightCode || resolving}
              >
                {resolving ? (
                  <SmallLoader />
                ) : 'Load Results'}
              </button>
            </div>
          </div>

          {(leftResult || rightResult) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Comparison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="border rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">You</h3>
                  {leftResult ? (
                    <p className="text-sm text-gray-700">
                      {leftResult.archetype?.name || "Unknown"} •{" "}
                      {new Date(leftResult.createdAt).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not loaded</p>
                  )}
                </div>
                <div className="border rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Friend</h3>
                  {rightResult ? (
                    <p className="text-sm text-gray-700">
                      {rightResult.archetype?.name || "Unknown"} •{" "}
                      {new Date(rightResult.createdAt).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not loaded</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {compareAxes.map((ax) => {
                  // Calculate positions and differences
                  const leftPercent = ax.left || 50;
                  const rightPercent = ax.right || 50;
                  const difference = Math.abs(leftPercent - rightPercent);
                  
                  // Determine dominant sides
                  const leftDominant = leftPercent > 50 ? ax.leftLabel : ax.rightLabel;
                  const rightDominant = rightPercent > 50 ? ax.leftLabel : ax.rightLabel;
                  
                  // Calculate alignment
                  const isAligned = (leftPercent > 50 && rightPercent > 50) || (leftPercent <= 50 && rightPercent <= 50);
                  const alignmentText = isAligned ? "Aligned" : "Opposite sides";
                  const alignmentColor = isAligned ? "text-green-600" : "text-red-600";
                  
                  // Get strength labels - updated scale
                  const getStrength = (percent) => {
                    const dominantPercent = Math.max(percent, 100 - percent);
                    if (dominantPercent >= 90) return "Extreme";
                    if (dominantPercent >= 80) return "Committed";
                    if (dominantPercent >= 70) return "Inclined";
                    if (dominantPercent >= 60) return "Leaning";
                    if (dominantPercent >= 55) return "Moderate";
                    return "Neutral";
                  };
                  
                  return (
                    <div key={ax.name} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{ax.name}</h4>
                          <div className={`text-sm font-medium ${alignmentColor} flex items-center gap-1`}>
                            {isAligned ? <FaCheckCircle /> : <FaTimesCircle />}
                            {alignmentText}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{ax.leftLabel}</span> vs <span className="font-medium">{ax.rightLabel}</span>
                          {difference > 0 && (
                            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                              {difference.toFixed(1)}% difference
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detailed Comparison */}
                      <div className="p-6">
                        {/* Full Axis Graph with Both Positions */}
                        <div className="mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <FaUsers className="text-blue-600" />
                              Axis Comparison View
                            </h5>
                            
                            {/* Custom Dual-Position Axis Graph */}
                            <div className="space-y-4">
                              {/* Axis Title */}
                              <h6 className="text-base font-semibold text-gray-900">{ax.name}</h6>
                              
                              {/* Axis Labels */}
                              <div className="flex justify-between items-center">
                                <div className="text-xs font-medium">
                                  <span className={`px-2 py-0.5 rounded-full text-white ${
                                    ax.name === "Equity vs. Free Market" ? "bg-blue-600" :
                                    ax.name === "Libertarian vs. Authoritarian" ? "bg-teal-500" :
                                    ax.name === "Progressive vs. Conservative" ? "bg-sky-500" :
                                    ax.name === "Secular vs. Religious" ? "bg-yellow-400" :
                                    ax.name === "Globalism vs. Nationalism" ? "bg-lime-500" :
                                    "bg-blue-600"
                                  }`}> 
                                    {ax.leftLabel}
                                  </span>
                                </div>
                                <div className="text-xs font-medium">
                                  <span className={`px-2 py-0.5 rounded-full text-white ${
                                    ax.name === "Equity vs. Free Market" ? "bg-green-600" :
                                    ax.name === "Libertarian vs. Authoritarian" ? "bg-orange-500" :
                                    ax.name === "Progressive vs. Conservative" ? "bg-red-400" :
                                    ax.name === "Secular vs. Religious" ? "bg-purple-500" :
                                    ax.name === "Globalism vs. Nationalism" ? "bg-rose-500" :
                                    "bg-green-600"
                                  }`}>
                                    {ax.rightLabel}
                                  </span>
                                </div>
                              </div>

                              {/* Axis bar with both positions */}
                              <div className="relative h-12 rounded-full overflow-hidden border border-gray-300">
                                {/* Left side gradient */}
                                <div className={`absolute inset-0 ${
                                  ax.name === "Equity vs. Free Market" ? "bg-gradient-to-r from-blue-600 via-gray-300 to-green-600" :
                                  ax.name === "Libertarian vs. Authoritarian" ? "bg-gradient-to-r from-teal-500 via-gray-300 to-orange-500" :
                                  ax.name === "Progressive vs. Conservative" ? "bg-gradient-to-r from-sky-500 via-gray-300 to-red-400" :
                                  ax.name === "Secular vs. Religious" ? "bg-gradient-to-r from-yellow-400 via-gray-300 to-purple-500" :
                                  ax.name === "Globalism vs. Nationalism" ? "bg-gradient-to-r from-lime-500 via-gray-300 to-rose-500" :
                                  "bg-gradient-to-r from-blue-600 via-gray-300 to-green-600"
                                }`}></div>
                                
                                {/* Your position marker */}
                                {ax.left !== null && (
                                  <div
                                    className="absolute top-0 bottom-0 w-2 h-full bg-yellow-400 border-2 border-yellow-600 z-30 transform -translate-x-1/2 shadow-lg"
                                    style={{ left: ax.left === 0 ? '99.5%' : `${leftPercent}%` }}
                                  ></div>
                                )}
                                
                                {/* Friend's position marker */}
                                {ax.right !== null && (
                                  <div
                                    className="absolute top-0 bottom-0 w-2 h-full bg-red-500 border-2 border-red-700 z-30 transform -translate-x-1/2 shadow-lg"
                                    style={{ left: `${Math.max(1, Math.min(99, 100 - rightPercent))}%` }}
                                  ></div>
                                )}

                                {/* Position labels */}
                                {ax.left !== null && (
                                  <div
                                    className="absolute -top-8 transform -translate-x-1/2 z-40"
                                    style={{ left: `${Math.max(1, Math.min(99, 100 - leftPercent))}%` }}
                                  >
                                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg border border-yellow-600">
                                      You: {ax.left}%
                                    </div>
                                  </div>
                                )}
                                
                                {ax.right !== null && (
                                  <div
                                    className="absolute -bottom-8 transform -translate-x-1/2 z-40"
                                    style={{ left: `${Math.max(1, Math.min(99, 100 - rightPercent))}%` }}
                                  >
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg border border-red-700">
                                      Friend: {ax.right}%
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Legend */}
                              <div className="flex items-center justify-center gap-6 text-xs">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-yellow-400 rounded border-2 border-yellow-600"></div>
                                  <span className="font-medium">Your Position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-red-500 rounded border-2 border-red-700"></div>
                                  <span className="font-medium">Friend's Position</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                              <span className="font-semibold text-blue-900">You</span>
                            </div>
                            {ax.left !== null ? (
                              <div className="space-y-2">
                                {/* <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold text-blue-900">{ax.left}%</span>
                                  <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                    {getStrength(leftPercent)} {leftDominant}
                                  </span>
                                </div> */}
                                <div className="text-sm text-blue-700 space-y-1">
                                  <div><strong>{ax.left}%</strong> {ax.leftLabel}</div>
                                  <div><strong>{(100 - ax.left)}%</strong> {ax.rightLabel}</div>
                                </div>
                                <div className="text-sm text-blue-700">
                                  Leans <strong>{leftPercent > 50 ? Math.round((leftPercent - 50) * 2) : Math.round((50 - leftPercent) * 2)}%</strong> {leftDominant}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500">No data available</div>
                            )}
                          </div>

                          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                              <span className="font-semibold text-indigo-900">Friend</span>
                            </div>
                            {ax.right !== null ? (
                              <div className="space-y-2">
                                {/* <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold text-indigo-900">{ax.right}%</span>
                                  <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                                    {getStrength(rightPercent)} {rightDominant}
                                  </span>
                                </div> */}
                                <div className="text-sm text-indigo-700 space-y-1">
                                  <div><strong>{ax.right}%</strong> {ax.leftLabel}</div>
                                  <div><strong>{(100 - ax.right)}%</strong> {ax.rightLabel}</div>
                                </div>
                                <div className="text-sm text-indigo-700">
                                  Leans <strong>{rightPercent > 50 ? Math.round((rightPercent - 50) * 2) : Math.round((50 - rightPercent) * 2)}%</strong> {rightDominant}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500">No data available</div>
                            )}
                          </div>
                        </div>

                       
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Question Analysis */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Your Detailed Responses
                </h3>
                <p className="text-center text-gray-600 mb-8">
                  Review your answers and your friend's answers for each
                  question, organized by political axis
                </p>

                {leftResult?.rawData?.questions &&
                leftResult?.rawData?.answers &&
                rightResult?.rawData?.questions &&
                rightResult?.rawData?.answers ? (
                  <div className="space-y-12">
                    {compareAxes.map((axis) => {
                      // Get questions for this axis
                      const leftAxisQuestions =
                        leftResult.rawData.questions.filter(
                          (q) => q.axis === axis.name
                        );
                      const rightAxisQuestions =
                        rightResult.rawData.questions.filter(
                          (q) => q.axis === axis.name
                        );

                      if (
                        leftAxisQuestions.length === 0 &&
                        rightAxisQuestions.length === 0
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={axis.name}
                          className="relative overflow-hidden"
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 opacity-60" />
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl" />

                          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                            {/* Glowing Header */}
                            <div className="relative px-10 py-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-indigo-600/50" />
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />

                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-2xl font-black text-white">
                                      {axis.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-3xl font-black text-white mb-2 tracking-tight">
                                      {axis.name}
                                    </h4>
                                    <div className="flex items-center space-x-3">
                                      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                                        {Math.max(
                                          leftAxisQuestions.length,
                                          rightAxisQuestions.length
                                        )}{" "}
                                        questions
                                      </span>
                                      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                                        Compare perspectives
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Score Display */}
                                <div className="text-right">
                                  <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                      <div className="text-4xl font-black text-white mb-1">
                                        {compareAxes.find(
                                          (a) => a.name === axis.name
                                        )?.left || 0}
                                        %
                                      </div>
                                      <div className="text-white/80 text-sm font-medium">
                                        You
                                      </div>
                                    </div>
                                    <div className="w-px h-16 bg-white/30" />
                                    <div className="text-center">
                                      <div className="text-4xl font-black text-white mb-1">
                                        {compareAxes.find(
                                          (a) => a.name === axis.name
                                        )?.right || 0}
                                        %
                                      </div>
                                      <div className="text-white/80 text-sm font-medium">
                                        Friend
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-10 space-y-10">
                              {Array.from(
                                new Set([
                                  ...leftAxisQuestions.map((q) => q._id),
                                  ...rightAxisQuestions.map((q) => q._id),
                                ])
                              ).map((questionId, index) => {
                                const leftQuestion =
                                  leftResult.rawData.questions.find(
                                    (q) => q._id === questionId
                                  );
                                const rightQuestion =
                                  rightResult.rawData.questions.find(
                                    (q) => q._id === questionId
                                  );
                                const question = leftQuestion || rightQuestion;

                                if (!question) return null;

                                const leftAnswer =
                                  leftResult.rawData.answers?.[questionId];
                                const rightAnswer =
                                  rightResult.rawData.answers?.[questionId];
                                const leftContext =
                                  leftResult.rawData.contextTexts?.[
                                    questionId
                                  ] || "";
                                const rightContext =
                                  rightResult.rawData.contextTexts?.[
                                    questionId
                                  ] || "";

                                const answerLabels = {
                                  "-2": "Agree",
                                  "-1": "Agree",
                                  0: "Agree",
                                  1: "Agree",
                                  2: "Agree",
                                };

                                const answerColors = {
                                  "-2": "from-red-500 to-red-600",
                                  "-1": "from-orange-500 to-orange-600",
                                  0: "from-gray-500 to-gray-600",
                                  1: "from-blue-500 to-blue-600",
                                  2: "from-green-500 to-green-600",
                                };

                                const answerNumbers = {
                                  "-2": "-2",
                                  "-1": "-1",
                                  0: "0",
                                  1: "+1",
                                  2: "+2",
                                };

                                return (
                                  <div
                                    key={questionId}
                                    className={`relative group ${
                                      index % 2 === 0
                                        ? "transform hover:-translate-y-1"
                                        : "transform hover:translate-y-1"
                                    } transition-all duration-500 ease-out`}
                                  >
                                    {/* Question Card */}
                                    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                                      {/* Question Header */}
                                      <div className="mb-8">
                                        <div className="flex items-start justify-between mb-6">
                                          <h5 className="font-black text-gray-900 text-2xl leading-tight flex-1 mr-6">
                                            {question.question}
                                          </h5>
                                          <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                              <span className="text-white font-black text-lg">
                                                Q{index + 1}
                                              </span>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                                              <span className="text-white text-xs font-bold">
                                                !
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {question.topic && (
                                          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200">
                                            <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" />
                                            <span className="text-purple-800 font-bold text-sm">
                                              {question.topic}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Answers Grid */}
                                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {/* Your Answer */}
                                        <div className="relative group/answer">
                                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl opacity-0 group-hover/answer:opacity-10 transition-opacity duration-300" />
                                          <div className="relative bg-white rounded-3xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-6">
                                              <h6 className="text-xl font-black text-blue-800 flex items-center">
                                                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-3 animate-pulse" />
                                                Your Answer
                                              </h6>
                                              <div className="px-3 py-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                                                {leftAnswer !== undefined &&
                                                leftAnswer !== null
                                                  ? answerNumbers[leftAnswer]
                                                  : "—"}
                                              </div>
                                            </div>

                                            {leftAnswer !== undefined &&
                                            leftAnswer !== null ? (
                                              <div className="space-y-6">
                                                <div className="flex items-center justify-center">
                                                  <span
                                                    className={`inline-block px-6 py-3 rounded-2xl text-lg font-black text-white shadow-xl bg-gradient-to-br ${answerColors[leftAnswer]} transform hover:scale-105 transition-transform duration-200`}
                                                  >
                                                    {answerLabels[leftAnswer]}
                                                  </span>
                                                </div>

                                                {leftContext.trim().length >
                                                  0 && (
                                                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5">
                                                    <p className="text-sm font-black text-blue-800 mb-3 flex items-center">
                                                      <span className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-3 animate-bounce" />
                                                      Additional Context
                                                    </p>
                                                    <p className="text-sm text-blue-700 leading-relaxed">
                                                      {leftContext}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="text-center py-12 text-gray-400">
                                                <div className="text-6xl mb-3">
                                                  —
                                                </div>
                                                <p className="text-lg font-medium">
                                                  Not answered
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Friend's Answer */}
                                        <div className="relative group/answer">
                                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover/answer:opacity-10 transition-opacity duration-300" />
                                          <div className="relative bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-6">
                                              <h6 className="text-xl font-black text-indigo-800 flex items-center">
                                                <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mr-3 animate-pulse" />
                                                Friend's Answer
                                              </h6>
                                              <div className="px-3 py-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                                                {rightAnswer !== undefined &&
                                                rightAnswer !== null
                                                  ? answerNumbers[rightAnswer]
                                                  : "—"}
                                              </div>
                                            </div>

                                            {rightAnswer !== undefined &&
                                            rightAnswer !== null ? (
                                              <div className="space-y-6">
                                                <div className="flex items-center justify-center">
                                                  <span
                                                    className={`inline-block px-6 py-3 rounded-2xl text-lg font-black text-white shadow-xl bg-gradient-to-br ${answerColors[rightAnswer]} transform hover:scale-105 transition-transform duration-200`}
                                                  >
                                                    {answerLabels[rightAnswer]}
                                                  </span>
                                                </div>

                                                {rightContext.trim().length >
                                                  0 && (
                                                  <div className="bg-gradient-to-br from-indigo-50 to-purple-100 border-2 border-indigo-200 rounded-2xl p-5">
                                                    <p className="text-sm font-black text-indigo-800 mb-3 flex items-center">
                                                      <span className="w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mr-3 animate-bounce" />
                                                      Additional Context
                                                    </p>
                                                    <p className="text-sm text-indigo-700 leading-relaxed">
                                                      {rightContext}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="text-center py-12 text-gray-400">
                                                <div className="text-6xl mb-3">
                                                  —
                                                </div>
                                                <p className="text-lg font-medium">
                                                  Not answered
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {compareQuestions.length > 0 && (
                <div className="mt-12">
                  <div className="space-y-6">
                    {/* Group questions by axis */}
                    {(() => {
                      const axisGroups = {};
                      compareQuestions.forEach((row) => {
                        if (!axisGroups[row.axis]) {
                          axisGroups[row.axis] = [];
                        }
                        axisGroups[row.axis].push(row);
                      });

                      return Object.entries(axisGroups).map(
                        ([axis, questions]) => (
                          <div
                            key={axis}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                          >
                            {/* Axis Header */}
                            <div
                              className={`px-6 py-4 border-b border-gray-200 ${
                                axis.includes("Equity")
                                  ? "bg-blue-50 border-blue-200"
                                  : axis.includes("Globalism")
                                  ? "bg-green-50 border-green-200"
                                  : axis.includes("Libertarian")
                                  ? "bg-purple-50 border-purple-200"
                                  : axis.includes("Progressive")
                                  ? "bg-orange-50 border-orange-200"
                                  : axis.includes("Secular")
                                  ? "bg-indigo-50 border-indigo-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <h4
                                className={`text-lg font-semibold ${
                                  axis.includes("Equity")
                                    ? "text-blue-800"
                                    : axis.includes("Globalism")
                                    ? "text-green-800"
                                    : axis.includes("Libertarian")
                                    ? "text-purple-800"
                                    : axis.includes("Progressive")
                                    ? "text-orange-800"
                                    : axis.includes("Secular")
                                    ? "text-indigo-800"
                                    : "text-gray-800"
                                }`}
                              >
                                {axis}
                              </h4>
                              <p
                                className={`text-sm mt-1 ${
                                  axis.includes("Equity")
                                    ? "text-blue-600"
                                    : axis.includes("Globalism")
                                    ? "text-green-600"
                                    : axis.includes("Libertarian")
                                    ? "text-purple-600"
                                    : axis.includes("Progressive")
                                    ? "text-orange-600"
                                    : axis.includes("Secular")
                                    ? "text-indigo-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {questions.length} question
                                {questions.length !== 1 ? "s" : ""}
                              </p>
                            </div>

                            {/* Questions Table */}
                            <div className="overflow-auto">
                              <table className="min-w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left px-6 py-3 w-20 md:w-36 font-medium text-gray-700 text-xs uppercase tracking-wide">
                                      Topic
                                    </th>
                                    <th className="text-left px-6 py-3 font-medium text-gray-700 text-xs uppercase tracking-wide">
                                      Question
                                    </th>
                                    <th className="text-left px-6 py-3 w-40 font-medium text-gray-700 text-xs uppercase tracking-wide">
                                      Your Answer
                                    </th>
                                    <th className="text-left px-6 py-3 w-40 font-medium text-gray-700 text-xs uppercase tracking-wide">
                                      Friend's Answer
                                    </th>
                                    <th className="text-left px-6 py-3 w-24 font-medium text-gray-700 text-xs uppercase tracking-wide">
                                      Alignment
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {questions.map((row, index) => {
                                    // Calculate alignment based on answer values
                                    const leftAnswer = row.left?.answer;
                                    const rightAnswer = row.right?.answer;

                                    let alignment = "Misalignment";
                                    let alignmentColor =
                                      "bg-red-100 text-red-800 border border-red-200";

                                    if (
                                      leftAnswer !== undefined &&
                                      leftAnswer !== null &&
                                      rightAnswer !== undefined &&
                                      rightAnswer !== null
                                    ) {
                                      if (leftAnswer === rightAnswer) {
                                        alignment = "Full Alignment";
                                        alignmentColor =
                                          "bg-green-100 text-green-800 border border-green-200";
                                      } else if (
                                        (leftAnswer >= 0 && rightAnswer >= 0) ||
                                        (leftAnswer <= 0 && rightAnswer <= 0)
                                      ) {
                                        alignment = "Partial Alignment";
                                        alignmentColor =
                                          "bg-yellow-100 text-yellow-800 border border-red-200";
                                      } else {
                                        alignment = "Misalignment";
                                        alignmentColor =
                                          "bg-red-100 text-red-800 border border-red-200";
                                      }
                                    }

                                    return (
                                      <tr
                                        key={row.questionId}
                                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                                          index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/30"
                                        }`}
                                      >
                                        <td className="px-3 sm:px-6 py-3 align-top md:whitespace-nowrap">
                                          {row.topic ? (
                                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                              {row.topic}
                                            </span>
                                          ) : (
                                            <span className="text-gray-400 text-xs">
                                              —
                                            </span>
                                          )}
                                        </td>

                                        <td className="px-3 min-w-64 sm:px-6 py-3 align-top">
                                          <div className="pr-4">
                                            <p className="text-gray-900 font-medium text-sm leading-relaxed">
                                              {row.question || ""}
                                            </p>
                                          </div>
                                        </td>

                                        <td className="px-3 sm:px-6 py-3 align-top whitespace-nowrap">
                                          {row.left ? (
                                            <div className="flex items-center gap-3">
                                              <span className="font-mono text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-blue-200 whitespace-nowrap">
                                                {row.left.answer === -2
                                                  ? "Strongly Disagree"
                                                  : row.left.answer === -1
                                                  ? "Disagree"
                                                  : row.left.answer === 0
                                                  ? "Neutral"
                                                  : row.left.answer === 1
                                                  ? "Agree"
                                                  : row.left.answer === 2
                                                  ? "Strongly Agree"
                                                  : "—"}
                                              </span>
                                              {/* {pill(row.left.contribution)} */}
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 text-sm">
                                              —
                                            </span>
                                          )}
                                        </td>

                                        <td className="px-3 sm:px-6 py-3 align-top whitespace-nowrap">
                                          {row.right ? (
                                            <div className="flex items-center gap-3">
                                              <span className="font-mono text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-indigo-200 whitespace-nowrap">
                                                {row.right.answer === -2
                                                  ? "Strongly Disagree"
                                                  : row.right.answer === -1
                                                  ? "Disagree"
                                                  : row.right.answer === 0
                                                  ? "Neutral"
                                                  : row.right.answer === 1
                                                  ? "Agree"
                                                  : row.right.answer === 2
                                                  ? "Strongly Agree"
                                                  : "—"}
                                              </span>
                                              {/* {pill(row.right.contribution)} */}
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 text-sm">
                                              —
                                            </span>
                                          )}
                                        </td>

                                        <td className="px-3 sm:px-6 py-3 align-top whitespace-nowrap">
                                          <div className="flex justify-center">
                                            {row.delta !== null ? (
                                              <div className="text-center">
                                                <span
                                                  className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                                                    row.delta === 0
                                                      ? "bg-green-100 text-green-800 border border-green-200"
                                                      : Math.abs(row.delta) ===
                                                        1
                                                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                      : "bg-red-100 text-red-800 border border-red-200"
                                                  }`}
                                                >
                                                  {row.delta === 0
                                                    ? "Full Alignment"
                                                    : Math.abs(row.delta) === 1
                                                    ? "Partial Alignment"
                                                    : "Misalignment"}
                                                </span>
                                              </div>
                                            ) : (
                                              <span className="text-gray-400 text-sm">
                                                —
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      
    </Layout>
  );
}
