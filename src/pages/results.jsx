import React, { useState, useEffect, useRef } from "react";
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
  FaChartPie,
  FaInfoCircle,
  FaSpinner,
  FaThumbsUp,
  FaThumbsDown,
  FaBalanceScale,
  FaBolt,
  FaCrown,
} from "react-icons/fa";
import ResultsProcessor from "../components/ResultsProcessor";
import AxisGraph from "../components/AxisGraph";
import DebugResultsTable from "../components/DebugResultsTable";
import MindMapContributeModal from "../components/MindMapContributeModal";
import AdSense from "../components/AdSense";
import AIPersonalitySummary from "../components/AIPersonalitySummary";
import AxisSpecificSummaries from "../components/AxisSpecificSummaries";
import PoliticalCompass from "../components/PoliticalCompass";
import { calculateAnswerScore, AXIS_ALIASES } from "../utils/resultsCalculator";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { track } from "@vercel/analytics";

// Helper function to convert answer value to agreement text
const getAgreementText = (answerValue) => {
  if (answerValue === 2) return "Strongly Agree";
  if (answerValue === 1) return "Agree";
  if (answerValue === 0) return "Neutral";
  if (answerValue === -1) return "Disagree";
  if (answerValue === -2) return "Strongly Disagree";
  return answerValue;
};

// Add this constant at the top level of the file, right after the imports
// It will be accessible to all functions in the file
const ARCHETYPE_MAP = [
  { code: "ELPSG", label: "The Utopian" },
  { code: "ELPSN", label: "The Reformer" },
  { code: "ELPRG", label: "The Prophet" },
  { code: "ELPRN", label: "The Firebrand" },
  { code: "ELCSG", label: "The Philosopher" },
  { code: "ELCSN", label: "The Localist" },
  { code: "ELCRG", label: "The Missionary" },
  { code: "ELCRN", label: "The Guardian" },
  { code: "EAPSG", label: "The Technocrat" },
  { code: "EAPSN", label: "The Enforcer" },
  { code: "EAPRG", label: "The Zealot" },
  { code: "EAPRN", label: "The Purist" },
  { code: "EACSG", label: "The Commander" },
  { code: "EACSN", label: "The Steward" },
  { code: "EACRG", label: "The Shepherd" },
  { code: "EACRN", label: "The High Priest" },
  { code: "FLPSG", label: "The Futurist" },
  { code: "FLPSN", label: "The Maverick" },
  { code: "FLPRG", label: "The Evangelist" },
  { code: "FLPRN", label: "The Dissenter" },
  { code: "FLCSG", label: "The Globalist" },
  { code: "FLCSN", label: "The Patriot" },
  { code: "FLCRG", label: "The Industrialist" },
  { code: "FLCRN", label: "The Traditionalist" },
  { code: "FAPSG", label: "The Overlord" },
  { code: "FAPSN", label: "The Corporatist" },
  { code: "FAPRG", label: "The Moralizer" },
  { code: "FAPRN", label: "The Builder" },
  { code: "FACSG", label: "The Executive" },
  { code: "FACSN", label: "The Ironhand" },
  { code: "FACRG", label: "The Regent" },
  { code: "FACRN", label: "The Crusader" },
];

export default function ResultsPage() {
  return (
    <Layout title="Your Results - Philosiq">
      <ResultsProcessor>
        <ResultsContent />
      </ResultsProcessor>
    </Layout>
  );
}

// Separated content component to receive processed results as props
function ResultsContent({ results }) {
  const router = useRouter();
  const resultsRef = useRef(null);

  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [axisLetters, setAxisLetters] = useState({});
  const [secondaryArchetypes, setSecondaryArchetypes] = useState([]);
  const [allPercents, setAllPercents] = useState([]);
  const [showMindMapModal, setShowMindMapModal] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [impactAnswers, setImpactAnswers] = useState(null);

  // Visual theme per axis for the Impact Answers section
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

  // Add state to store axis breakdown data
  const [axisBreakdownData, setAxisBreakdownData] = useState({});

  // Get the raw data from session storage for debugging
  const [rawData, setRawData] = useState(null);

  // Check if the quiz was a full quiz or short quiz
  const [isFullQuiz, setIsFullQuiz] = useState(false);

  // Add state to track if results have been saved
  const [resultsSaved, setResultsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Add a useRef to track if secondaryArchetypes have been calculated
  const secondaryArchetypesCalculated = useRef(false);

  // Add state to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [isCheckingPlus, setIsCheckingPlus] = useState(true);

  // Pregeneration states
  const [generalSummary, setGeneralSummary] = useState("");
  const [generalSummaryLoading, setGeneralSummaryLoading] = useState(false);
  const [generalSummaryError, setGeneralSummaryError] = useState("");
  const [axisSummaries, setAxisSummaries] = useState({});
  const [axisSummariesLoading, setAxisSummariesLoading] = useState({});
  const [axisSummariesError, setAxisSummariesError] = useState({});

  // Add useEffect to check quiz type and authentication when component mounts
  useEffect(() => {
    try {
      let storedData = sessionStorage.getItem("quizResults");
      if (!storedData) {
        storedData = localStorage.getItem("quizResults");
      }
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setIsFullQuiz(parsedData.quizType === "full");
        // Do not initialize resultsSaved from storage; it's per-session and auth-bound
      }
      // Check authentication
      const token = localStorage.getItem("authToken");
      const authed = !!token;
      setIsAuthenticated(authed);
      if (!authed) {
        // Ensure saved state is cleared when logged out so success banner doesn't show
        setResultsSaved(false);
      }
      // Attempt to load user email and check Philosiq+ status
      if (token) {
        const storedEmail = localStorage.getItem("userEmail");
        const check = async () => {
          try {
            let email = storedEmail;
            // Always verify token first
            const resp = await fetch("/api/auth/user", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!resp.ok) {
              // Token invalid or expired, force logout state
              console.warn("Invalid or expired token; clearing auth state");
              localStorage.removeItem("authToken");
              localStorage.removeItem("userEmail");
              setIsAuthenticated(false);
              setResultsSaved(false);
              return;
            }
            const user = await resp.json();
            if (!email) {
              email = user?.email;
              if (email) localStorage.setItem("userEmail", email);
            }
            if (email) {
              const statusResp = await fetch(
                `/api/user/plus-status?email=${encodeURIComponent(email)}`
              );
              if (statusResp.ok) {
                const { active } = await statusResp.json();
                setIsPlusActive(!!active);
              }
            }
          } catch (e) {
            console.error("Error checking plus status:", e);
          } finally {
            setIsCheckingPlus(false);
          }
        };
        check();
      } else {
        setIsCheckingPlus(false);
      }
    } catch (error) {
      console.error("Error initializing ResultsContent:", error);
      setIsCheckingPlus(false);
    }
  }, []);

  // Keep auth state in sync across tabs and after visibility changes
  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem("authToken");
      const authed = !!token;
      if (!authed) {
        if (isAuthenticated) setIsAuthenticated(false);
        if (resultsSaved) setResultsSaved(false);
        return;
      }
      // Verify token quickly to prevent stale auth
      try {
        const resp = await fetch("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
          setIsAuthenticated(false);
          setResultsSaved(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        // Network error: don't flip auth to true; be conservative
        setIsAuthenticated(false);
        setResultsSaved(false);
      }
    };

    const onStorage = (e) => {
      if (!e || e.key === null || e.key === "authToken") {
        syncAuth();
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") syncAuth();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    // Initial sync
    syncAuth();
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, resultsSaved]);

  // Re-verify token when isAuthenticated toggles to true
  useEffect(() => {
    const verify = async () => {
      if (!isAuthenticated) return;
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        setResultsSaved(false);
        return;
      }
      try {
        const resp = await fetch("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
          setIsAuthenticated(false);
          setResultsSaved(false);
        }
      } catch {
        setIsAuthenticated(false);
        setResultsSaved(false);
      }
    };
    verify();
  }, [isAuthenticated]);

  // Pregenerate AI summaries when results are available
  useEffect(() => {
    const pregenerateSummaries = async () => {
      if (!results || !rawData?.questions || !rawData?.answers) return;

      const answers =
        rawData.questions?.map((q) => ({
          question: q.question,
          answer: rawData.answers?.[q._id] || 0,
          axis: q.axis || "general",
        })) || [];

      if (answers.length === 0) return;

      // Pregenerate general summary
      if (!generalSummary && !generalSummaryLoading) {
        setGeneralSummaryLoading(true);
        try {
          const response = await fetch("/api/ai/generate-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answers: answers,
              userEmail: localStorage.getItem("userEmail") || "",
              userId: localStorage.getItem("userId") || "unknown",
              axisDataByName: axisBreakdownData,
            }),
          });

          const data = await response.json();
          if (response.ok && data.summary) {
            setGeneralSummary(data.summary);
            // Store in session storage for saving
            sessionStorage.setItem("aiSummary", data.summary);
          } else {
            setGeneralSummaryError(data.error || "Failed to generate summary");
          }
        } catch (error) {
          setGeneralSummaryError(error.message);
          console.error("General summary generation error:", error);
        } finally {
          setGeneralSummaryLoading(false);
        }
      }

      // Pregenerate axis summaries for Philosiq+ users
      if (isPlusActive && Object.keys(axisSummaries).length === 0) {
        const axisNames = [
          "Equity vs. Free Market",
          "Libertarian vs. Authoritarian",
          "Progressive vs. Conservative",
          "Secular vs. Religious",
          "Globalism vs. Nationalism",
        ];

        for (const axisName of axisNames) {
          if (axisSummariesLoading[axisName]) continue; // Already loading

          setAxisSummariesLoading((prev) => ({ ...prev, [axisName]: true }));

          try {
            // Filter answers for this axis
            const axisAnswers = answers.filter(
              (answer) => answer.axis === axisName
            );

            if (axisAnswers.length > 0) {
              const axisData = axisBreakdownData[axisName];

              const response = await fetch("/api/ai/generate-axis-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  axisName,
                  answers: axisAnswers,
                  userEmail: localStorage.getItem("userEmail") || "",
                  userId: localStorage.getItem("userId") || "unknown",
                  axisData: axisData || null,
                }),
              });

              const data = await response.json();
              if (response.ok && data.summary) {
                setAxisSummaries((prev) => ({
                  ...prev,
                  [axisName]: data.summary,
                }));
              } else {
                setAxisSummariesError((prev) => ({
                  ...prev,
                  [axisName]: data.error || "Failed to generate summary",
                }));
              }
            }
          } catch (error) {
            setAxisSummariesError((prev) => ({
              ...prev,
              [axisName]: error.message,
            }));
            console.error(
              `Axis summary generation error for ${axisName}:`,
              error
            );
          } finally {
            setAxisSummariesLoading((prev) => ({ ...prev, [axisName]: false }));
          }
        }
      }
    };

    pregenerateSummaries();
  }, [
    results,
    rawData,
    axisBreakdownData,
    isPlusActive,
    generalSummary,
    generalSummaryLoading,
    axisSummaries,
    axisSummariesLoading,
  ]);

  // Compute Impact Answers when results and raw data are available
  useEffect(() => {
    try {
      if (
        !results ||
        !results.axisResults ||
        !rawData?.questions ||
        !rawData?.answers
      )
        return;

      // Build a quick lookup for axis result sign (-1, 0, 1)
      const axisSignByName = {};
      results.axisResults.forEach((ar) => {
        const sign = ar?.rawScore === 0 ? 0 : ar?.rawScore > 0 ? 1 : -1;
        axisSignByName[ar.name] = sign;
      });

      // Group answered questions by canonical axis with contribution
      const grouped = {};
      rawData.questions.forEach((q) => {
        const answer = rawData.answers?.[q._id];
        if (answer === undefined || answer === null) return;

        const canonicalAxis = AXIS_ALIASES[q.axis] || q.axis;
        const agreeWeight = q.weight_agree || q.weight || 1;
        const disagreeWeight = q.weight_disagree || q.weight || 1;
        const contribution = calculateAnswerScore(
          answer,
          agreeWeight,
          disagreeWeight,
          q.direction
        );

        if (!contribution) return; // skip neutral/no contribution

        if (!grouped[canonicalAxis]) grouped[canonicalAxis] = [];
        grouped[canonicalAxis].push({
          id: q._id,
          axis: canonicalAxis,
          question: q.question,
          topic: q.topic,
          direction: q.direction,
          answerValue: answer,
          contribution,
          abs: Math.abs(contribution),
        });
      });

      // For each axis, pick top 2 aligned and top 2 against based on abs contribution
      const result = {};
      Object.keys(grouped).forEach((axisName) => {
        const items = grouped[axisName].sort((a, b) => b.abs - a.abs);
        const axisSign = axisSignByName[axisName] ?? 0;

        if (axisSign === 0) {
          // Centered: pick top positives as aligned, top negatives as against
          const aligned = items.filter((x) => x.contribution > 0).slice(0, 2);
          const against = items.filter((x) => x.contribution < 0).slice(0, 2);
          result[axisName] = { aligned, against };
        } else {
          // Special handling for axes that need flipped logic
          const isSecularAxis = axisName === "Secular vs. Religious";
          const isEquityAxis = axisName === "Equity vs. Free Market";
          const needsFlip = isSecularAxis || isEquityAxis;

          const aligned = items
            .filter((x) => {
              if (needsFlip) {
                // For axes that need flipped logic
                return axisSign > 0 ? x.contribution < 0 : x.contribution > 0;
              } else {
                return axisSign > 0 ? x.contribution > 0 : x.contribution < 0;
              }
            })
            .slice(0, 2);
          const against = items
            .filter((x) => {
              if (needsFlip) {
                // For axes that need flipped logic
                return axisSign > 0 ? x.contribution > 0 : x.contribution < 0;
              } else {
                return axisSign > 0 ? x.contribution < 0 : x.contribution > 0;
              }
            })
            .slice(0, 2);
          result[axisName] = { aligned, against };
        }
      });

      setImpactAnswers(result);
    } catch (e) {
      console.warn("Failed to compute Impact Answers", e);
    }
  }, [results, rawData]);

  // Refresh plus status if redirected back from Stripe (and confirm session)
  useEffect(() => {
    const handleUpgradeSuccess = async () => {
      const email = localStorage.getItem("userEmail");
      const sessionId = router.query.session_id;
      try {
        if (router.query.upgrade === "success" && sessionId) {
          await fetch(
            `/api/stripe/confirm-session?session_id=${encodeURIComponent(
              sessionId
            )}`
          );
        }
        if (email) {
          const r = await fetch(
            `/api/user/plus-status?email=${encodeURIComponent(email)}`
          );
          if (r.ok) {
            const d = await r.json();
            setIsPlusActive(!!d?.active);
          }
        }
      } finally {
        const { upgrade, session_id, ...rest } = router.query;
        router.replace({ pathname: router.pathname, query: rest }, undefined, {
          shallow: true,
        });
      }
      try {
        track("plus_upgrade_returned", { email });
      } catch {}
    };
    if (router.query.upgrade === "success") handleUpgradeSuccess();
  }, [router.query.upgrade, router.query.session_id]);

  const startCheckout = async () => {
    if (!isAuthenticated) {
      setShowSubscriptionModal(false);
      setShowLoginModal(true);
      return;
    }
    try {
      let email = localStorage.getItem("userEmail");
      if (!email) {
        const token = localStorage.getItem("authToken");
        if (token) {
          const r = await fetch("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (r.ok) {
            const u = await r.json();
            email = u?.email;
            if (email) localStorage.setItem("userEmail", email);
          }
        }
      }
      if (!email) {
        alert(
          "We couldn't determine your email. Please login again and retry."
        );
        setShowSubscriptionModal(false);
        return;
      }
      const resp = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to start checkout");
      track("plus_checkout_started", { email });
      window.location.href = data.url;
    } catch (e) {
      console.error("startCheckout error", e);
      alert(`Unable to start checkout: ${(e && e.message) || "Unknown error"}`);
    }
  };

  const openBillingPortal = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) return alert("No user email found.");
      const resp = await fetch("/api/stripe/portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to open portal");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Unable to open billing portal.");
    }
  };

  // Track when results are viewed
  useEffect(() => {
    if (results && results.archetype) {
      track("results_viewed", {
        archetype: results.archetype.name,
        quizType: isFullQuiz ? "full" : "short",
      });
    }
  }, [results, isFullQuiz]);

  // Memoize the handleUpdate function to prevent unnecessary re-renders
  const handleUpdate = React.useCallback((name, data) => {
    setAllPercents((prev) => ({
      ...prev,
      [name]: data,
    }));
  }, []);

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
    // Only update if the letter is different to prevent unnecessary re-renders
    setAxisLetters((prev) => {
      if (prev[axisName] === letter) return prev;
      return { ...prev, [axisName]: letter };
    });
  };

  // Function to handle axis breakdown data updates
  const handleAxisDataUpdate = (axisName, axisData) => {
    setAxisBreakdownData((prev) => {
      // Only update if the data has changed to prevent unnecessary re-renders
      if (
        prev[axisName] &&
        prev[axisName].score === axisData.score &&
        prev[axisName].positionStrength === axisData.positionStrength
      ) {
        return prev;
      }
      return { ...prev, [axisName]: axisData };
    });
  };

  // Log the axis letters when they change and calculate secondary archetypes
  useEffect(() => {
    // Only run this effect if we have all 5 axis letters and haven't calculated secondaries yet
    if (
      Object.keys(axisLetters).length === 5 &&
      !secondaryArchetypesCalculated.current
    ) {
      console.log(
        "Calculating archetypes with complete axis letters:",
        axisLetters
      );

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

      // Set the primary archetype based on the code
      const primaryArchetype = ARCHETYPE_MAP.find(
        (entry) => entry.code === archetypeCode
      );
      if (primaryArchetype) {
        // Update the results archetype if present
        if (results && results.archetype) {
          results.archetype.name = primaryArchetype.label;
          results.archetype.code = archetypeCode;
        }
      }

      // Calculate secondary archetypes
      calculateSecondaryArchetypes(axisLetters, axisOrder);

      // Mark that we've calculated secondary archetypes
      secondaryArchetypesCalculated.current = true;
    }
  }, [axisLetters, results]);

  // Calculate secondary archetypes based on primary archetype letters
  const calculateSecondaryArchetypes = (letters, axisOrder) => {
    if (!letters || Object.keys(letters).length < 5) {
      console.log("Not enough letters to calculate secondary archetypes");
      return;
    }

    console.log("Calculating secondary archetypes with letters:", letters);

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

    // Get axis percentages and categorize them
    const axisScores = {};
    const axesAt50 = []; // Axes exactly at 50%
    const axesOther = []; // All other axes

    if (!results || !results.axisResults) {
      console.log("No results or axisResults available");
      return;
    }

    results.axisResults.forEach((axis) => {
      const canonicalName =
        axis.name === "Equality vs. Markets"
          ? "Equity vs. Free Market"
          : axis.name;

      axisScores[canonicalName] = axis.score;

      // Check if axis score is exactly 50%
      if (Math.abs(axis.score - 50) < 0.01) {
        // Use a small threshold to account for floating point precision
        axesAt50.push(canonicalName);
      } else {
        // Consider all other axes for flipping, not just those above 50%
        axesOther.push(canonicalName);
      }
    });

    // Prioritize axes exactly at 50% first, then add all other axes
    let axesToConsider = [...axesAt50];

    // If we don't have enough axes at exactly 50%, add in all other axes
    if (axesToConsider.length < 2) {
      axesToConsider = [...axesToConsider, ...axesOther];
    }

    // If we still don't have any axes to consider, log and return empty
    if (axesToConsider.length === 0) {
      console.log("No axes found, no secondary archetypes generated.");
      setSecondaryArchetypes([]);
      return;
    }

    // Sort axes:
    // 1. Exact 50% axes first (these are perfect candidates for flipping)
    // 2. Then sort remaining axes by closeness to 50%
    const sortedAxes = [...axesToConsider].sort((a, b) => {
      const aIs50 = axesAt50.includes(a);
      const bIs50 = axesAt50.includes(b);

      // If one is at 50% and the other isn't, prioritize the 50% one
      if (aIs50 && !bIs50) return -1;
      if (!aIs50 && bIs50) return 1;

      // If neither is at 50%, sort by closeness to 50% (absolute distance)
      if (!aIs50 && !bIs50) {
        return Math.abs(axisScores[a] - 50) - Math.abs(axisScores[b] - 50);
      }

      // If both are at 50%, keep original order
      return 0;
    });

    // Get up to 2 axes with highest priority for flipping
    const axesToFlip = sortedAxes.slice(0, Math.min(2, sortedAxes.length));

    // Create secondary archetypes by flipping the letter of the selected axes
    const secondaries = [];

    axesToFlip.forEach((axisToFlip, index) => {
      // Create a copy of the original letters
      const newLetters = { ...letters };

      // Flip the letter for the selected axis
      if (newLetters[axisToFlip]) {
        newLetters[axisToFlip] =
          oppositeLetters[newLetters[axisToFlip]] || newLetters[axisToFlip];
      }

      // Generate the code for this secondary archetype
      const secondaryCode = axisOrder
        .map((axis) => newLetters[axis] || "?")
        .join("");

      // Find the matching archetype in the array
      const archetypeEntry = ARCHETYPE_MAP.find(
        (entry) => entry.code === secondaryCode
      );
      const archetypeName = archetypeEntry
        ? archetypeEntry.label
        : "Alternative Archetype";

      // Calculate match percentage based on the score of the flipped axis
      // We need to always use the value that's less than or equal to 50% (the smaller side)
      let axisScore;
      if (allPercents[axisToFlip]) {
        const leftValue = parseFloat(
          allPercents[axisToFlip].leftPercent || "50"
        );
        const rightValue = parseFloat(
          allPercents[axisToFlip].rightPercent || "50"
        );
        // Take the smaller value (which is always <= 50%)
        axisScore = Math.min(leftValue, rightValue);
      } else {
        // Fallback if no percentages available
        axisScore = axisScores[axisToFlip] || 50;
      }

      // Use the formula: Percent Match = 100 - ((-FlippedAxisScore + 50) * 2)
      // For exactly 50%, this gives 100% match
      // For scores below 50%, the lower the score, the lower the match percentage
      let matchPercent;
      if (Math.abs(axisScore - 50) < 0.01) {
        // For scores exactly at 50%
        matchPercent = 100;
      } else {
        // Apply the formula: 100 - ((-FlippedAxisScore + 50) * 2)
        // This converts the range from 0-50 to 100-0
        matchPercent = Math.round(100 - (50 - axisScore) * 2);

        // Ensure the match percentage is between 60% and 95%
        matchPercent = Math.min(95, Math.max(60, matchPercent));
      }

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
        name: archetypeName,
        code: secondaryCode,
        match: `${matchPercent}% match`,
        traits: traits,
        flippedAxis: axisToFlip,
        slug: secondaryCode.toLowerCase(),
      });
    });

    console.log("Generated secondary archetypes:", secondaries);

    // Only update state if the secondaries are different
    setSecondaryArchetypes((prev) => {
      // Simple check if arrays are different by comparing length and first item
      if (
        prev.length !== secondaries.length ||
        (prev.length > 0 &&
          secondaries.length > 0 &&
          prev[0].code !== secondaries[0].code)
      ) {
        return secondaries;
      }
      return prev;
    });
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("Please enter your email address");
      return;
    }

    try {
      setIsPdfGenerating(true);

      // Track email sending start
      track("email_results_started", {
        archetype: results.archetype?.name || "Unknown",
      });

      // Create a new PDF document with minimal styling
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Set initial position
      let y = 40; // Starting y position
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
        return y + 20; // Just add space instead of drawing a line
      };

      // Add title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("PhilosiQ Political Archetype Results", margin, y);
      y += 20;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
      y = addSeparator(y + 10);

      // Add primary archetype
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      y += 10;
      pdf.text(
        `Your Archetype: ${results.archetype?.name || "Unknown"}`,
        margin,
        y
      );
      y += 20;

      // Add traits
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const traits = [];
      if (Object.keys(axisLetters).length > 0) {
        Object.entries(axisLetters).forEach(([axis, letter]) => {
          let trait = "";
          switch (axis) {
            case "Equity vs. Free Market":
              trait = letter === "E" ? "Equity" : "Free Market";
              break;
            case "Libertarian vs. Authoritarian":
              trait = letter === "L" ? "Libertarian" : "Authoritarian";
              break;
            case "Progressive vs. Conservative":
              trait = letter === "P" ? "Progressive" : "Conservative";
              break;
            case "Secular vs. Religious":
              trait = letter === "S" ? "Secular" : "Religious";
              break;
            case "Globalism vs. Nationalism":
              trait = letter === "G" ? "Globalism" : "Nationalism";
              break;
          }
          traits.push(trait);
        });
      }

      pdf.text(`Traits: ${traits.join(", ")}`, margin, y);
      y += 15;

      // Add description
      const description = getArchetypeDescription(results.archetype?.name);
      pdf.setFontSize(11);
      y = addWrappedText(description, margin, y, contentWidth, 15);
      y = addSeparator(y);

      // Add axis breakdown section
      y += 10;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Political Axis Breakdown", margin, y);
      y += 20;

      // Add each axis
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      results.axisResults.forEach((axis, index) => {
        // Check if we need to add a new page
        if (y > pdf.internal.pageSize.getHeight() - 80) {
          pdf.addPage();
          y = 40;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text(axis.name, margin, y);
        y += 15;

        pdf.setFont("helvetica", "normal");

        // Get the correct percentages from axisBreakdownData
        const axisName = axis.name;
        const axisData = axisBreakdownData[axisName];

        // Use the percentages from the child component if available, otherwise fallback to calculation
        const leftPercent = axisData ? axisData.leftPercent : axis.score;
        const rightPercent = axisData
          ? axisData.rightPercent
          : 100 - axis.score;

        pdf.text(`${axis.leftLabel}: ${leftPercent}%`, margin, y);
        y += 15;
        pdf.text(`${axis.rightLabel}: ${rightPercent}%`, margin, y);
        y += 15;

        // Add a simple text indicator of position
        let positionText = "";

        // Use the position and strength from axisData if available
        if (axisData && axisData.userPosition && axisData.positionStrength) {
          positionText = `${axisData.positionStrength} ${axisData.userPosition}`;
        } else if (axis.positionStrength && axis.userPosition) {
          // Fallback to the axis data from results
          positionText = `${axis.positionStrength} ${axis.userPosition}`;
        } else {
          // Legacy fallback calculation if no position data is available
          if (axis.score > 50) {
            // Left side positions
            const strength =
              axis.score >= 80
                ? "Extreme"
                : axis.score >= 70
                ? "Committed"
                : axis.score >= 60
                ? "Inclined"
                : "Leaning";
            positionText = `${strength} ${axis.leftLabel}`;
          } else if (axis.score < 50) {
            // Right side positions
            const strength =
              axis.score <= 20
                ? "Extreme"
                : axis.score <= 30
                ? "Committed"
                : axis.score <= 40
                ? "Inclined"
                : "Leaning";
            positionText = `${strength} ${axis.rightLabel}`;
          } else {
            positionText = "Centrist position";
          }
        }

        pdf.text(`Position: ${positionText}`, margin, y);
        y += 20;

        if (index < results.axisResults.length - 1) {
          y = addSeparator(y);
        }
      });

      // Get the PDF as base64 data
      const pdfData = pdf.output("datauristring").split(",")[1];

      // Send the PDF via email
      const response = await fetch("/api/quiz/email-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          pdfData: pdfData,
          archetypeName: results.archetype?.name || "Unknown",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }

      // Track successful email
      track("email_results_completed", {
        archetype: results.archetype?.name || "Unknown",
      });

      setEmailSent(true);
    } catch (error) {
      console.error("Error sending results email:", error);
      alert("Failed to send email. Please try again.");

      // Track email error
      track("email_results_error", {
        error: error.message || "Unknown error",
        archetype: results.archetype?.name || "Unknown",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);

    try {
      // Track PDF download start
      track("pdf_download_started", {
        archetype: results.archetype?.name || "Unknown",
      });

      // Create a new PDF document with minimal styling
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Set initial position
      let y = 40; // Starting y position
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
        return y + 20; // Just add space instead of drawing a line
      };

      // Add title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("PhilosiQ Political Archetype Results", margin, y);
      y += 20;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
      y = addSeparator(y + 10);

      // Add primary archetype
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      y += 10;
      pdf.text(
        `Your Archetype: ${results.archetype?.name || "Unknown"}`,
        margin,
        y
      );
      y += 20;

      // Add traits
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const traits = [];
      if (Object.keys(axisLetters).length > 0) {
        Object.entries(axisLetters).forEach(([axis, letter]) => {
          let trait = "";
          switch (axis) {
            case "Equity vs. Free Market":
              trait = letter === "E" ? "Equity" : "Free Market";
              break;
            case "Libertarian vs. Authoritarian":
              trait = letter === "L" ? "Libertarian" : "Authoritarian";
              break;
            case "Progressive vs. Conservative":
              trait = letter === "P" ? "Progressive" : "Conservative";
              break;
            case "Secular vs. Religious":
              trait = letter === "S" ? "Secular" : "Religious";
              break;
            case "Globalism vs. Nationalism":
              trait = letter === "G" ? "Globalism" : "Nationalism";
              break;
          }
          traits.push(trait);
        });
      }

      pdf.text(`Traits: ${traits.join(", ")}`, margin, y);
      y += 15;

      // Add description
      const description = getArchetypeDescription(results.archetype?.name);
      pdf.setFontSize(11);
      y = addWrappedText(description, margin, y, contentWidth, 15);
      y = addSeparator(y);

      // Add axis breakdown section
      y += 10;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Political Axis Breakdown", margin, y);
      y += 20;

      // Add each axis
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      results.axisResults.forEach((axis, index) => {
        // Check if we need to add a new page
        if (y > pdf.internal.pageSize.getHeight() - 80) {
          pdf.addPage();
          y = 40;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text(axis.name, margin, y);
        y += 15;

        pdf.setFont("helvetica", "normal");

        // Get the correct percentages from axisBreakdownData
        const axisName = axis.name;
        const axisData = axisBreakdownData[axisName];

        // Use the percentages from the child component if available, otherwise fallback to calculation
        const leftPercent = axisData ? axisData.leftPercent : axis.score;
        const rightPercent = axisData
          ? axisData.rightPercent
          : 100 - axis.score;

        pdf.text(`${axis.leftLabel}: ${leftPercent}%`, margin, y);
        y += 15;
        pdf.text(`${axis.rightLabel}: ${rightPercent}%`, margin, y);
        y += 15;

        // Add a simple text indicator of position
        let positionText = "";

        // Use the position and strength from axisData if available
        if (axisData && axisData.userPosition && axisData.positionStrength) {
          positionText = `${axisData.positionStrength} ${axisData.userPosition}`;
        } else if (axis.positionStrength && axis.userPosition) {
          // Fallback to the axis data from results
          positionText = `${axis.positionStrength} ${axis.userPosition}`;
        } else {
          // Legacy fallback calculation if no position data is available
          if (axis.score > 50) {
            // Left side positions
            const strength =
              axis.score >= 80
                ? "Extreme"
                : axis.score >= 70
                ? "Committed"
                : axis.score >= 60
                ? "Inclined"
                : "Leaning";
            positionText = `${strength} ${axis.leftLabel}`;
          } else if (axis.score < 50) {
            // Right side positions
            const strength =
              axis.score <= 20
                ? "Extreme"
                : axis.score <= 30
                ? "Committed"
                : axis.score <= 40
                ? "Inclined"
                : "Leaning";
            positionText = `${strength} ${axis.rightLabel}`;
          } else {
            positionText = "Centrist position";
          }
        }

        pdf.text(`Position: ${positionText}`, margin, y);
        y += 20;

        if (index < results.axisResults.length - 1) {
          y = addSeparator(y);
        }
      });

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
      const archetypeName = results.archetype?.name || "Results";
      const date = new Date().toISOString().split("T")[0];
      const filename = `Philosiq-${archetypeName.replace(
        /\s+/g,
        "-"
      )}-${date}.pdf`;

      // Save the PDF (this will trigger the download)
      pdf.save(filename);

      // Track successful download from here
      track("pdf_download_completed", {
        archetype: results.archetype?.name || "Unknown",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");

      // Track PDF error
      track("pdf_download_error", {
        error: error.message || "Unknown error",
        archetype: results.archetype?.name || "Unknown",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  {
    results.axisResults.map((axis, index) => {
      console.log("from parent axis graph", axis);
    });
  }

  // Starting at line 615
  const handleSaveResults = async () => {
    if (!isAuthenticated) {
      // If not logged in, prompt login instead of proceeding
      setShowLoginModal(true);
      return;
    }
    if (resultsSaved || isSaving) return;

    setIsSaving(true);
    try {
      console.log("Attempting to save results...");
      const response = await saveFinalResultsToDatabase(
        results,
        secondaryArchetypes
      );
      console.log("Save response:", response);

      if (response && response.success) {
        setResultsSaved(true);
        track("results_saved", {
          archetype: results.archetype?.name || "Unknown",
          quizType: isFullQuiz ? "full" : "short",
        });
        console.log("Results saved successfully, resultId:", response.resultId);
      } else {
        console.error(
          "Failed to save results:",
          response?.message || "Unknown error"
        );
        alert("Failed to save results. Please try again.");
      }
    } catch (error) {
      console.error("Error saving results:", error);
      alert("Failed to save results. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Starting at line 629
  const saveFinalResultsToDatabase = async (results, secondaryArchetypes) => {
    try {
      console.log("Saving results to database");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found, user not authenticated.");
        return { success: false, message: "User not authenticated" };
      }

      if (!results || !results.archetype || !results.archetype.name) {
        console.error("Invalid results data, missing archetype name");
        return { success: false, message: "Invalid results data" };
      }

      const traits = Object.entries(axisLetters).map(([axis, letter]) => {
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

      const secondaryArchetypesData = secondaryArchetypes.map((archetype) => ({
        name: archetype.name,
        code: archetype.code,
        match: archetype.match,
        traits: archetype.traits,
        flippedAxis: archetype.flippedAxis,
      }));

      const axisBreakdownArray = Object.values(axisBreakdownData).map(
        (axis) => ({
          name: axis.name,
          score: axis.score,
          rawScore: axis.rawScore,
          leftLabel: axis.leftLabel,
          rightLabel: axis.rightLabel,
          userPosition: axis.userPosition,
          positionStrength: axis.positionStrength,
          leftPercent: axis.leftPercent,
          rightPercent: axis.rightPercent,
        })
      );

      // Build per-question answer breakdown for comparison feature
      const answerBreakdown = [];
      try {
        if (rawData?.questions && rawData?.answers) {
          rawData.questions.forEach((q) => {
            const ans = rawData.answers?.[q._id];
            if (ans === undefined || ans === null) return;
            const canonicalAxis = AXIS_ALIASES[q.axis] || q.axis;
            const agreeWeight = q.weight_agree || q.weight || 1;
            const disagreeWeight = q.weight_disagree || q.weight || 1;
            const contribution = calculateAnswerScore(
              ans,
              agreeWeight,
              disagreeWeight,
              q.direction
            );
            // Store minimal fields necessary for cross-user comparison
            answerBreakdown.push({
              questionId: q._id,
              axis: canonicalAxis,
              topic: q.topic,
              question: q.question,
              answer: ans,
              contribution,
              context: rawData.contextTexts?.[q._id] || "",
            });
          });
        }
      } catch (e) {
        console.warn("Failed to build answerBreakdown", e);
      }

      // Use pregenerated axis summaries or generate them if not available
      let finalAxisSummaries = {};
      if (isPlusActive && answerBreakdown.length > 0) {
        // Use pregenerated summaries if available
        if (Object.keys(axisSummaries).length > 0) {
          finalAxisSummaries = axisSummaries;
          console.log("Using pregenerated axis summaries");
        } else {
          // Fallback: generate axis summaries if not pregenerated
          try {
            console.log("Generating axis summaries for Philosiq+ user...");
            const axisNames = [
              "Equity vs. Free Market",
              "Libertarian vs. Authoritarian",
              "Progressive vs. Conservative",
              "Secular vs. Religious",
              "Globalism vs. Nationalism",
            ];

            for (const axisName of axisNames) {
              try {
                // Filter answers for this axis
                const axisAnswers = answerBreakdown
                  .filter((answer) => answer.axis === axisName)
                  .map((answer) => ({
                    question: answer.question,
                    answer: answer.answer,
                    axis: answer.axis,
                  }));

                if (axisAnswers.length > 0) {
                  const axisData = axisBreakdownData[axisName];
                  const userEmail = localStorage.getItem("userEmail");

                  const response = await fetch(
                    "/api/ai/generate-axis-summary",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        axisName,
                        answers: axisAnswers,
                        userEmail: userEmail || "",
                        userId: localStorage.getItem("userId") || "unknown",
                        axisData: axisData || null,
                      }),
                    }
                  );

                  if (response.ok) {
                    const data = await response.json();
                    finalAxisSummaries[axisName] = data.summary;
                    console.log(
                      `Generated summary for ${axisName}:`,
                      data.summary?.substring(0, 100) + "..."
                    );
                  } else {
                    console.warn(`Failed to generate summary for ${axisName}`);
                  }
                }
              } catch (error) {
                console.error(
                  `Error generating summary for ${axisName}:`,
                  error
                );
              }
            }
          } catch (error) {
            console.error("Error generating axis summaries:", error);
          }
        }
      }

      const resultsData = {
        archetype: {
          name: results.archetype.name,
          traits: traits.length > 0 ? traits : results.archetype.traits || [],
        },
        secondaryArchetypes: secondaryArchetypesData,
        axisBreakdown: axisBreakdownArray,
        answerBreakdown,
        impactAnswers, // Add the impact answers data
        aiSummary: (() => {
          try {
            return sessionStorage.getItem("aiSummary") || null;
          } catch {
            return null;
          }
        })(),
        axisSummaries: finalAxisSummaries, // Add the axis summaries
        isPlusActive, // Add the plus status
        quizType: isFullQuiz ? "full" : "short",
        requestId: Math.random().toString(36).substring(2), // Add for debugging
      };

      console.log("Saving to database:", resultsData);

      const response = await fetch("/api/quiz/save-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resultsData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save results");
      }

      console.log("Results saved successfully.");
      return responseData;
    } catch (error) {
      console.error("Error saving data to database:", error);
      throw error;
    }
  };

  // If no results are passed, the ResultsProcessor component will handle it
  if (!results) return null;

  console.log(
    "Results page rendered with secondaryArchetypes:",
    secondaryArchetypes.length
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
      <div className="container-custom">
        {/* Main Results Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Your Quiz Results</h1>
          <p className="text-lg text-gray-600 mb-4">
            Importiq has crunched the numbers—here's the political archetype
            that fits you best
          </p>

          <div className="flex justify-center">
            {/* Save Results Button - Prominent Position */}
            {!resultsSaved && (
              <>
                {isAuthenticated ? (
                  <button
                    onClick={handleSaveResults}
                    disabled={isSaving}
                    className={`px-8 py-3 rounded-full font-medium text-lg shadow-md transition-all ${
                      isSaving
                        ? "bg-gray-300 text-gray-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save Your Results to Account"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-8 py-3 rounded-full font-medium text-lg shadow-md transition-all bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                  >
                    Login to Save Results
                  </button>
                )}
              </>
            )}
            {resultsSaved && isAuthenticated && (
              <div className="px-8 py-3 rounded-full font-medium text-lg bg-green-500 text-white">
                ✓ Results Saved Successfully
              </div>
            )}
          </div>
        </div>

        {/* Login Modal or Redirect */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-3">Login Required</h2>
              <p className="mb-6 text-gray-700">
                You need to log in or register to save your results to your
                account.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    // Store current URL for return after login
                    if (typeof window !== "undefined") {
                      const currentUrl =
                        window.location.pathname + window.location.search;
                      localStorage.setItem("returnUrl", currentUrl);
                    }
                    router.push("/login");
                  }}
                  className="px-4 py-2 bg-primary-maroon text-white rounded hover:bg-primary-darkMaroon"
                >
                  Login / Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Archetype Card */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 text-center relative">
              {/* Top decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full opacity-30 translate-x-1/2 -translate-y-1/3"></div>

              <h2 className="text-5xl font-bold mb-4 text-gray-800 relative">
                {archetype.name}
              </h2>

              {/* Display the axis letters badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {Object.keys(axisLetters).length > 0
                  ? Object.entries(axisLetters).map(([axis, letter]) => {
                      // Determine the label based on the letter
                      let label = "";
                      let bgColor = "bg-gray-200";

                      switch (axis) {
                        case "Equity vs. Free Market":
                          label = letter === "E" ? "Equity" : "Free Market";
                          bgColor =
                            letter === "E"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white";
                          break;
                        case "Libertarian vs. Authoritarian":
                          label =
                            letter === "L" ? "Libertarian" : "Authoritarian";
                          bgColor =
                            letter === "L"
                              ? "bg-teal-500 text-white"
                              : "bg-orange-500 text-white";
                          break;
                        case "Progressive vs. Conservative":
                          label =
                            letter === "P" ? "Progressive" : "Conservative";
                          bgColor =
                            letter === "P"
                              ? "bg-sky-500 text-white"
                              : "bg-red-400 text-white";
                          break;
                        case "Secular vs. Religious":
                          label = letter === "S" ? "Secular" : "Religious";
                          bgColor =
                            letter === "S"
                              ? "bg-yellow-400 text-white"
                              : "bg-purple-500 text-white";
                          break;
                        case "Globalism vs. Nationalism":
                          label = letter === "G" ? "Globalism" : "Nationalism";
                          bgColor =
                            letter === "G"
                              ? "bg-lime-500 text-white"
                              : "bg-rose-500 text-white";
                          break;
                        default:
                          label = letter;
                      }

                      return (
                        <span
                          key={axis}
                          className={`${bgColor} px-4 py-1 rounded-full text-sm`}
                        >
                          {label}
                        </span>
                      );
                    })
                  : // Fall back to the original traits if axis letters not yet available
                    archetype.traits.map((trait, index) => {
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

              {/* Description box */}
              <div className=" p-2 mb-6  max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {archetype.description}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href={`/archetypes/${archetype.id}`}
                  className="bg-red-600 text-white inline-flex items-center px-6 py-3 rounded-full transition-all hover:shadow-lg"
                  shallow={false}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/archetypes/${archetype.id}`;
                  }}
                >
                  Learn More About Your Archetype{" "}
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>

              {/* Bottom decorative element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
            </div>
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
            {results.axisResults.map((axis, index) => {
              return (
                <AxisGraph
                  key={index}
                  name={axis.name}
                  score={axis.score}
                  updatePercents={handleUpdate}
                  questions={rawData?.questions}
                  answers={rawData?.answers}
                  rawScore={axis.rawScore}
                  leftLabel={axis.leftLabel}
                  rightLabel={axis.rightLabel}
                  userPosition={axis.userPosition}
                  positionStrength={axis.positionStrength}
                  onLetterDetermined={handleLetterDetermined}
                  onAxisDataUpdate={handleAxisDataUpdate}
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

        {/* AI Personality Summary */}
        <div className="mb-16">
          <AIPersonalitySummary
            answers={
              rawData?.questions?.map((q) => ({
                question: q.question,
                answer: rawData.answers?.[q._id] || 0,
                axis: q.axis || "general",
              })) || []
            }
            userEmail={localStorage.getItem("userEmail")}
            isPhilosiQPlus={isPlusActive}
            axisDataByName={axisBreakdownData}
            pregeneratedSummary={generalSummary}
            pregeneratedLoading={generalSummaryLoading}
            pregeneratedError={generalSummaryError}
          />
        </div>

        {/* Political Compass */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Political Compass
          </h2>
          <div className="max-w-2xl mx-auto">
            <PoliticalCompass
              axisResults={Object.values(axisBreakdownData)}
              answers={results.originalAnswers}
              questions={results.originalQuestions}
            />
          </div>
        </div>

        {/* Axis-Specific AI Summaries - Philosiq+ Only */}
        <div className="mb-16">
          <AxisSpecificSummaries
            answers={
              results.originalQuestions?.map((q, index) => {
                console.log("Mapping question from results:", q); // Debug log
                return {
                  question: q.question || `Question ${index + 1}`,
                  answer: results.originalAnswers?.[q._id] || 0,
                  axis: q.axis || "general",
                };
              }) || []
            }
            userEmail={localStorage.getItem("userEmail")}
            isPhilosiQPlus={isPlusActive}
            axisDataByName={axisBreakdownData}
            pregeneratedSummaries={axisSummaries}
            pregeneratedLoading={axisSummariesLoading}
            pregeneratedErrors={axisSummariesError}
          />
        </div>

        {/* Debug Section */}
        {/* {rawData && (
          <div className="mb-16 no-print">
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
        )} */}

        {/* Impact Answers */}
        {impactAnswers && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2 text-center flex items-center justify-center gap-2">
              <FaBolt className="text-yellow-500" /> The Balance Board
            </h2>
            <p className="text-center text-gray-600 mb-8">
              The Balance Board is where your score's story comes to life. On
              one side are the answers that propelled you toward your result. On
              the other are the ones that pulled you back from the edge.
              Together, they show why you landed exactly where you did.
            </p>

            <div className="space-y-8">
              {/* Show only first axis for free users, all axes for plus users */}
              {results.axisResults
                .filter((_, index) => isPlusActive || index === 0)
                .map((axis, index) => {
                  const data = impactAnswers[axis.name] || {
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
                                    {rawData?.contextTexts?.[item.id] && (
                                      <p className="text-xs opacity-75 mt-1 text-blue-600">
                                        Context: {rawData.contextTexts[item.id]}
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
                                    {rawData?.contextTexts?.[item.id] && (
                                      <p className="text-xs opacity-75 mt-1 text-blue-600">
                                        Context: {rawData.contextTexts[item.id]}
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
              {!isPlusActive && results.axisResults.length > 1 && (
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
                        Upgrade to Philosiq+ to see your complete Balance Board
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    You're currently seeing only the first axis. Upgrade to
                    Philosiq+ to access all {results.axisResults.length} axes
                    and get the full picture of what influenced your political
                    archetype.
                  </p>

                  <button
                    onClick={startCheckout}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
                  >
                    Upgrade to Philosiq+
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Impact score reflects how strongly an answer moved your result on
              that axis (sign shows direction).
            </p>
          </div>
        )}

        {/* MindMap Contribute Section - Add this before the Share Results section */}
        {isFullQuiz && (
          <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden no-print">
            <div className="bg-gradient-to-r from-primary-maroon to-secondary-darkBlue p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Contribute to MindMap</h2>
              <p>
                Help us understand how demographics correlate with political
                beliefs by anonymously contributing your data.
              </p>
              <p className="text-sm text-blue-600 mt-2">
                <FaInfoCircle className="inline-block mr-1" />
                This feature is exclusively available for full quiz results.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-lg font-semibold mb-2">
                    What is MindMap?
                  </h3>
                  <p className="text-gray-600">
                    MindMap visualizes how demographic factors like age,
                    education, and location correlate with political archetypes.
                    Your anonymous contribution helps build a more comprehensive
                    picture.
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/mindmap";
                    }}
                    className="mt-3 text-primary-maroon hover:text-primary-darkMaroon flex items-center"
                  >
                    <span>View MindMap</span> <FaArrowRight className="ml-1" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowMindMapModal(true);
                  }}
                  className="bg-primary-maroon text-white px-6 py-3 rounded-full flex items-center text-start font-medium hover:shadow-lg transition-all"
                >
                  <FaChartPie size={27} className="mr-2 min-w-10" /> Contribute
                  Anonymously
                </button>
              </div>
            </div>
          </div>
        )}

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
                      {archetype.traits.map((trait, i) => {
                        // Define colors for different traits
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
                          {archetype.flippedAxis.replace(" vs. ", "/")}
                        </span>
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      {getArchetypeDescription(archetype.name)}
                    </div>

                    <Link
                      href={`/archetypes/${archetype.slug}`}
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
                      shallow={false}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/archetypes/${archetype.slug}`;
                      }}
                    >
                      View Details <FaArrowRight className="ml-1.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Feature Section - Blurred until Philosiq+ */}

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Upgrade to Philosiq+
                </h2>
                <p className="text-gray-600 mb-6">
                  Unlock advanced analysis, detailed insights, and exclusive
                  features to better understand your political archetype.
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-4">
                    What's included:
                  </h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Detailed personality analysis
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Career recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Archetype compatibility insights
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Historical figure comparisons
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Advanced political positioning
                    </li>
                  </ul>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    $4.99 / quarter
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubscriptionModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      setShowSubscriptionModal(false);
                      startCheckout();
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Results */}
        <div className="mb-16 no-print">
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
                      Check your inbox for your Philosiq results.
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
                        disabled={isPdfGenerating}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary-outline flex justify-center items-center"
                      disabled={isPdfGenerating}
                    >
                      {isPdfGenerating ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Sending...
                        </>
                      ) : (
                        "Send Results"
                      )}
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
                  disabled={isPdfGenerating}
                  className="w-full btn-primary-outline flex justify-center items-center"
                >
                  {isPdfGenerating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Generating
                      PDF...
                    </>
                  ) : (
                    "Download PDF"
                  )}
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
        <div className="text-center no-print">
          <Link
            href="/quiz"
            className="btn-secondary inline-flex items-center"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/quiz";
            }}
          >
            Take Quiz Again <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* MindMap Contribute Modal */}
      {isFullQuiz && (
        <MindMapContributeModal
          isOpen={showMindMapModal}
          onClose={() => setShowMindMapModal(false)}
          archetype={results?.archetype?.name}
          axisScores={results?.axisResults?.reduce((acc, axis) => {
            acc[axis.name] = axis.score;
            return acc;
          }, {})}
        />
      )}
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
    "The Utopian":
      "You envision a world rooted in equality, individual freedom, progressive change, secularism, and global cooperation.",
    "The Reformer":
      "You champion social justice, personal liberty, and reform at home, grounded in secular ideals and national identity.",
    "The Prophet":
      "You seek a just and free society guided by progressive and religious values, with a global sense of mission.",
    "The Firebrand":
      "You are a passionate advocate for radical change and faith-based morality, driven by national identity and personal freedom.",
    "The Philosopher":
      "You value intellectual freedom, equity, and tradition, guided by secular thought and a global perspective.",
    "The Localist":
      "You prioritize community-centered equity and freedom, rooted in secular traditions and national loyalty.",
    "The Missionary":
      "You believe in social compassion and religious morality, aiming to spread equity and freedom worldwide.",
    "The Guardian":
      "You stand for faith, equity, and liberty, seeking to preserve traditional values within a sovereign nation.",
    "The Technocrat":
      "You support structured equity and progress through systems and innovation, favoring secularism and international cooperation.",
    "The Enforcer":
      "You believe in justice through order, guided by secular progressivism and national strength.",
    "The Zealot":
      "You fight for a righteous and equal world, merging strong authority, progressive ideals, and religious conviction.",
    "The Purist":
      "You envision a morally upright and equitable society, protected by national sovereignty and guided by faith.",
    "The Commander":
      "You support strong leadership, economic equity, and conservative traditions, in service of a global order.",
    "The Steward":
      "You prioritize traditional values and market economics, with a balanced approach to authority and national sovereignty.",
    "The Shepherd":
      "You seek a stable society built on faith, tradition, and fairness, with global compassion and structure.",
    "The High Priest":
      "You champion a sacred national order rooted in tradition, morality, and economic fairness through authority.",
    "The Futurist":
      "You advocate for innovation, freedom, and global progress, guided by secular and market-oriented values.",
    "The Maverick":
      "You support social freedom, innovation, and national self-determination, unbound by tradition or authority.",
    "The Evangelist":
      "You believe in personal liberty and spiritual progress, spreading free-market ideals and global moral purpose.",
    "The Dissenter":
      "You challenge authority and tradition, guided by faith, progress, and a patriotic spirit.",
    "The Globalist":
      "You value free markets, personal liberty, and cultural heritage, with a focus on global engagement.",
    "The Patriot":
      "You defend individual freedom and national traditions, driven by a belief in markets and sovereignty.",
    "The Industrialist":
      "You believe in moral capitalism, traditional values, and spreading prosperity on a global scale.",
    "The Traditionalist":
      "You uphold religion, market capitalism, and national heritage, guided by liberty and cultural continuity.",
    "The Overlord":
      "You believe in order, free markets, and secular progress, enforced through centralized authority and global ambition.",
    "The Corporatist":
      "You promote market-driven progress under firm national leadership, favoring order and secular development.",
    "The Moralizer":
      "You envision a structured, prosperous society shaped by faith, authority, and progressive mission.",
    "The Builder":
      "You believe in a strong, moral nation led by authority and innovation, grounded in market economics.",
    "The Executive":
      "You value control, efficiency, and economic freedom, with a secular and global vision for stability.",
    "The Ironhand":
      "You believe in discipline, free enterprise, and tradition, secured by national strength and centralized power.",
    "The Regent":
      "You seek a structured and moral global order, guided by faith, tradition, and capitalist efficiency.",
    "The Crusader":
      "You fight for a sacred national identity, upheld by tradition, authority, and free-market values.",

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
    "The High Priest": "from-green-500 to-blue-400",
    "The Technocrat": "from-green-500 to-blue-400",
    "The Guardian": "from-green-500 to-blue-400",
    "The Missionary": "from-green-500 to-blue-400",
    "The Localist": "from-green-500 to-blue-400",
    "The Philosopher": "from-green-500 to-blue-400",
    "The Firebrand": "from-green-500 to-blue-400",
    "The Prophet": "from-green-500 to-blue-400",
    "The Reformer": "from-green-500 to-blue-400",
    "The Utopian": "from-green-500 to-blue-400",
    "Unknown Archetype": "from-gray-500 to-gray-400",
  };

  return colors[archetypeName] || colors["Unknown Archetype"];
}
