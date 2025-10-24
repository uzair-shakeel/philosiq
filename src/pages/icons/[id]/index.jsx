import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import {
  FaUser,
  FaCalendar,
  FaGlobe,
  FaExternalLinkAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaSpinner,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../../../components/Navbar";

export default function IconProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { id } = router.query;

  const [icon, setIcon] = useState(null);
  const [fullDescription, setFullDescription] = useState("");
  const [answers, setAnswers] = useState([]);
  const [alternativeAnswers, setAlternativeAnswers] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState({});
  const [showAlternatives, setShowAlternatives] = useState({});
  const [error, setError] = useState("");
  // throttle duplicate vote clicks and collect counter-evidence for downvotes
  const [lastVoteAt, setLastVoteAt] = useState({});
  const [counterModal, setCounterModal] = useState({
    open: false,
    answerId: null,
    title: "",
    url: "",
    description: "",
  });
  const [axisOpen, setAxisOpen] = useState({});
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (authToken && userEmail) {
      setUser({
        name: userName || "",
        email: userEmail || "",
        token: authToken,
      });
    }

    if (!id) return;
    fetchIconData();
  }, [id]);

  const fetchIconData = async () => {
    try {
      setLoading(true);
      const [iconResponse, answersResponse] = await Promise.all([
        axios.get(`/api/icons/${id}?includeAnswers=true`),
        axios.get("/api/icons/answers", {
          params: { iconId: id, includeAlternatives: true },
        }),
      ]);

      setIcon(iconResponse.data.icon);
      // Always try to fetch the full first paragraph from Wikipedia (prefer full intro via action=query)
      try {
        const title = iconResponse?.data?.icon?.wikipediaTitle;
        const stored = iconResponse?.data?.icon?.description || "";
        if (title) {
          // 1) Try full intro with first paragraph using MediaWiki action API
          try {
            const r = await axios.get(
              `https://en.wikipedia.org/w/api.php`,
              {
                params: {
                  origin: '*',
                  format: 'json',
                  action: 'query',
                  prop: 'extracts',
                  explaintext: 1,
                  exintro: 1,
                  redirects: 1,
                  titles: title,
                },
              }
            );
            const pages = r?.data?.query?.pages || {};
            const page = Object.values(pages)[0];
            const fullIntro = (page?.extract || '').trim();
            // Take the entire first paragraph (until a double newline) if present
            const firstPara = fullIntro.split(/\n\s*\n/)[0] || fullIntro;
            if (firstPara && firstPara.length > stored.length) {
              setFullDescription(firstPara);
            } else if (fullIntro) {
              setFullDescription(fullIntro);
            } else {
              throw new Error('Empty extract');
            }
          } catch {
            // 2) Fallback to REST summary API
            const wiki = await axios.get(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
            );
            const extract = (wiki?.data?.extract || '').trim();
            setFullDescription(extract || stored);
          }
        } else {
          setFullDescription(stored);
        }
      } catch (e) {
        // Fallback to stored description on any error
        setFullDescription(iconResponse?.data?.icon?.description || "");
      }

      // Build primary answer per question = highest confirmed (upvotes/netVotes)
      const byQuestion = {};
      (answersResponse.data.answers || []).forEach((a) => {
        const qid = a.question?._id || a.question;
        if (!qid) return;
        if (!byQuestion[qid]) byQuestion[qid] = [];
        byQuestion[qid].push(a);
      });

      const primaryAnswers = [];
      const alternatives = {};
      Object.keys(byQuestion).forEach((qid) => {
        const list = byQuestion[qid];
        const sorted = [...list].sort((x, y) => {
          const ax = (typeof x.netVotes === 'number' ? x.netVotes : x.upvotes || 0);
          const ay = (typeof y.netVotes === 'number' ? y.netVotes : y.upvotes || 0);
          return ay - ax;
        });
        const best = sorted[0];
        if (best) primaryAnswers.push(best);
        alternatives[qid] = sorted.slice(1);
      });

      setAnswers(primaryAnswers);
      setAlternativeAnswers(alternatives);

      // If user is logged in, fetch their votes
      if (user) {
        // This would require a separate API endpoint to get user votes
        // For now, we'll implement voting without pre-loading user votes
      }
    } catch (error) {
      console.error("Error fetching icon data:", error);
      setError("Failed to load icon data");
    } finally {
      setLoading(false);
    }
  };

  const recomputePrimaryFromState = () => {
    const byQuestion = {};
    (answers || []).forEach((a) => {
      const qid = a.question?._id || a.question;
      if (!qid) return;
      if (!byQuestion[qid]) byQuestion[qid] = [];
      byQuestion[qid].push(a);
    });

    const primaryAnswers = [];
    Object.keys(byQuestion).forEach((qid) => {
      const list = byQuestion[qid];
      const sorted = [...list].sort((x, y) => {
        const ax = (typeof x.netVotes === 'number' ? x.netVotes : x.upvotes || 0);
        const ay = (typeof y.netVotes === 'number' ? y.netVotes : y.upvotes || 0);
        return ay - ax;
      });
      const best = sorted[0];
      if (best) primaryAnswers.push(best);
    });

    setAnswers(primaryAnswers);
  };

  const handleVote = async (answerId, voteType, counterEvidence) => {
    if (!user) {
      router.push(`/login?redirect=icons/${id}`);
      return;
    }

    // Prevent spamming: ignore if a vote is already in-flight or within 1.5s window
    if (votingLoading[answerId]) return;
    const now = Date.now();
    if (lastVoteAt[answerId] && now - lastVoteAt[answerId] < 1500) return;

    // If user already has this vote type selected, do nothing
    if (userVotes[answerId] === voteType) return;

    // Require counter-evidence for downvotes
    if (voteType === "downvote" && !counterEvidence) {
      setCounterModal({
        open: true,
        answerId,
        title: "",
        url: "",
        description: "",
      });
      return;
    }

    setVotingLoading((prev) => ({ ...prev, [answerId]: true }));

    try {
      const response = await axios.post(
        "/api/icons/answers/vote",
        {
          answerId,
          voteType,
          counterEvidence,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the answer in state
      setAnswers((prev) =>
        prev.map((answer) =>
          answer._id === answerId
            ? { ...answer, ...response.data.answer }
            : answer
        )
      );

      // Update alternative answers if needed
      setAlternativeAnswers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((questionId) => {
          updated[questionId] = updated[questionId].map((answer) =>
            answer._id === answerId
              ? { ...answer, ...response.data.answer }
              : answer
          );
        });
        return updated;
      });

      // Update user votes tracking from server-confirmed state
      const serverType = response.data?.currentVoteType || voteType;
      setUserVotes((prev) => ({ ...prev, [answerId]: serverType }));
      setLastVoteAt((prev) => ({ ...prev, [answerId]: now }));
      // After any vote, re-evaluate which answer is primary per question
      recomputePrimaryFromState();
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVotingLoading((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  const handleDownvoteRequest = (answerId) => {
    // If user has already submitted an alternative on this question, allow direct downvote
    const qid = findQuestionIdByAnswerId(answerId);
    if (qid && hasUserAlternativeForQuestion(qid)) {
      handleVote(answerId, "downvote", {
        title: "user-submitted-alternative",
        url: "about:blank",
        description: "Auto-allowed (has alternative)",
      });
      return;
    }
    // Otherwise fall back to counter-evidence modal
    handleVote(answerId, "downvote");
  };

  const submitCounterEvidence = async () => {
    const { answerId, title, url, description } = counterModal;
    if (!answerId || !title.trim() || !url.trim()) return;
    await handleVote(answerId, "downvote", {
      title: title.trim(),
      url: url.trim(),
      description: (description || "").trim(),
    });
    setCounterModal({
      open: false,
      answerId: null,
      title: "",
      url: "",
      description: "",
    });
  };

  const closeCounterModal = () =>
    setCounterModal({
      open: false,
      answerId: null,
      title: "",
      url: "",
      description: "",
    });

  const toggleAlternatives = (questionId) => {
    setShowAlternatives((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Determine if current user has already submitted any alternative for the given question
  const hasUserAlternativeForQuestion = (questionId) => {
    if (!user) return false;
    const alts = alternativeAnswers[questionId] || [];
    return alts.some((alt) => {
      const sb = alt.submittedBy;
      // submittedBy may be a string (email/id) or an object with email
      if (typeof sb === "string") {
        return sb === user.email || sb === user.name;
      }
      if (sb && typeof sb === "object") {
        return (
          sb.email === user.email ||
          sb.name === user.name ||
          sb.id === user.email
        );
      }
      return false;
    });
  };

  // Find the questionId owning a given answerId (search accepted and alternatives)
  const findQuestionIdByAnswerId = (answerId) => {
    const acc = answers.find((a) => a._id === answerId);
    if (acc) return acc.question._id;
    for (const qid of Object.keys(alternativeAnswers)) {
      const hit = (alternativeAnswers[qid] || []).find(
        (a) => a._id === answerId
      );
      if (hit) return qid;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <video
          src="/Loading.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[80%] h-[80%] object-contain"
        />
      </div>
    );
  }

  if (error || !icon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Icon not found"}
          </h1>
          <Link href="/icons" className="text-blue-600 hover:text-blue-700">
            ← Back to Icons
          </Link>
        </div>
      </div>
    );
  }

  // Group accepted answers by axis for a shorter, structured layout
  const axisOrder = [
    "Equity vs. Free Market",
    "Libertarian vs. Authoritarian",
    "Progressive vs. Conservative",
    "Secular vs. Religious",
    "Globalism vs. Nationalism",
  ];
  const groupedAnswers = answers.reduce((acc, a) => {
    const ax = a.question.axis;
    (acc[ax] = acc[ax] || []).push(a);
    return acc;
  }, {});
  // Toggle: if undefined (initial), first click collapses (sets false). Thereafter toggles boolean.
  const toggleAxis = (axis) =>
    setAxisOpen((prev) => {
      const current = prev[axis];
      const next = current === undefined ? false : !current;
      return { ...prev, [axis]: next };
    });

  return (
    <>
      <Head>
        <title>{icon.name} - Political Profile - Philosiq Icons</title>
        <meta
          name="description"
          content={`Political compass profile of ${icon.name} based on community research`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />

        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-4">
              <Link
                href="/icons"
                className="flex items-center text-gray-600 hover:text-gray-900 w-fit"
              >
                <FaArrowLeft className="mr-2" />
                Back to Icons
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image */}
              <div className="flex-shrink-0">
                {icon.imageUrl ? (
                  <img
                    src={icon.imageUrl}
                    alt={icon.name}
                    className="w-40 h-52 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-40 h-52 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                    <FaUser className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-[3] min-w-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {icon.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xl text-gray-600">{icon.occupation}</p>
                </div>

                {/* Dates */}
                {(icon.birthDate || icon.deathDate) && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendar className="mr-2" />
                    {icon.birthDate && icon.deathDate
                      ? `${icon.birthDate} - ${icon.deathDate}`
                      : icon.birthDate
                      ? `Born ${icon.birthDate}`
                      : `Died ${icon.deathDate}`}
                  </div>
                )}

                {/* Description */}
                {(() => {
                  const text = (fullDescription || icon.description || "").trim();
                  const words = text ? text.split(/\s+/) : [];
                  const overLimit = words.length > 100;
                  const display = descExpanded || !overLimit
                    ? text
                    : words.slice(0, 100).join(" ") + "…";
                  return (
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed whitespace-normal break-words overflow-visible">
                        {display}
                      </p>
                      {overLimit && (
                        <button
                          type="button"
                          onClick={() => setDescExpanded((v) => !v)}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {descExpanded ? "See less" : "See more"}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Axis Percentage Bars (refined, labels with small badges) */}
                <div className="mb-6">
                  <div className="space-y-3">
                    {[
                      { key: 'equityVsFreeMarket', axis: 'Equity vs. Free Market' },
                      { key: 'libertarianVsAuthoritarian', axis: 'Libertarian vs. Authoritarian' },
                      { key: 'progressiveVsConservative', axis: 'Progressive vs. Conservative' },
                      { key: 'secularVsReligious', axis: 'Secular vs. Religious' },
                      { key: 'globalismVsNationalism', axis: 'Globalism vs. Nationalism' },
                    ].map(({ key, axis }) => {
                      const score = Number(icon?.scores?.[key] || 0);
                      const leftPct = Math.max(0, Math.min(100, Math.round(50 - score / 2)));
                      const rightPct = 100 - leftPct;
                      let leftStrong = 'bg-blue-600', rightStrong = 'bg-green-600';
                      let leftMuted = 'bg-blue-200', rightMuted = 'bg-green-200';
                      let leftBadge = 'bg-blue-100 text-blue-700', rightBadge = 'bg-green-100 text-green-700';
                      switch (axis) {
                        case 'Libertarian vs. Authoritarian':
                          leftStrong = 'bg-teal-500'; rightStrong = 'bg-orange-500';
                          leftMuted = 'bg-teal-200'; rightMuted = 'bg-orange-200';
                          leftBadge = 'bg-teal-100 text-teal-700'; rightBadge = 'bg-orange-100 text-orange-700';
                          break;
                        case 'Progressive vs. Conservative':
                          leftStrong = 'bg-sky-500'; rightStrong = 'bg-red-400';
                          leftMuted = 'bg-sky-200'; rightMuted = 'bg-red-200';
                          leftBadge = 'bg-sky-100 text-sky-700'; rightBadge = 'bg-red-100 text-red-700';
                          break;
                        case 'Secular vs. Religious':
                          leftStrong = 'bg-yellow-400'; rightStrong = 'bg-purple-500';
                          leftMuted = 'bg-yellow-200'; rightMuted = 'bg-purple-200';
                          leftBadge = 'bg-yellow-100 text-yellow-800'; rightBadge = 'bg-purple-100 text-purple-700';
                          break;
                        case 'Globalism vs. Nationalism':
                          leftStrong = 'bg-lime-500'; rightStrong = 'bg-rose-500';
                          leftMuted = 'bg-lime-200'; rightMuted = 'bg-rose-200';
                          leftBadge = 'bg-lime-100 text-lime-700'; rightBadge = 'bg-rose-100 text-rose-700';
                          break;
                        default:
                          break;
                      }
                      const [leftLabel, rightLabel] = axis.split(' vs. ');
                      const dominantLeft = leftPct >= rightPct;
                      const leftBarClass = dominantLeft ? leftStrong : leftMuted;
                      const rightBarClass = dominantLeft ? rightMuted : rightStrong;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                              {leftLabel}

                              {dominantLeft && (
                                <span className={`px-1.5 py-0.5 rounded-full font-medium ${leftBadge}`}>{leftPct}%</span>
                              )}
                            </span>
                            <span className="flex items-center gap-2">
                              {!dominantLeft && (
                                <span className={`px-1.5 py-0.5 rounded-full font-medium ${rightBadge}`}>{rightPct}%</span>
                              )}
                              {rightLabel}
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full border border-gray-200 bg-white overflow-hidden relative">
                            <div className={`absolute left-0 top-0 bottom-0 ${leftBarClass}`} style={{ width: `${leftPct}%` }} />
                            <div className={`absolute right-0 top-0 bottom-0 ${rightBarClass}`} style={{ width: `${rightPct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    </div>
                    </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <FaQuestionCircle className="mr-2" />
                    {icon.totalAnswers} questions answered
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/icons/${id}/quiz`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Take Quiz as {icon.name}
                  </Link>

                  <a
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                      icon.wikipediaTitle
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    View on Wikipedia
                  </a>
                </div>
              </div>

              {/* Political Compass */}
              <div className="flex-[1] min-w-[280px] md:max-w-[320px]">
                <PoliticalCompass icon={icon} />
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Political Positions
            </h2>
            {user && (
              <p className="text-sm text-gray-600">
                Vote on answers or suggest alternatives
              </p>
            )}
          </div>

          {answers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FaQuestionCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No answers yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to answer questions as {icon.name}!
              </p>
              <Link
                href={`/icons/${id}/quiz`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit className="mr-2" />
                Start Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {axisOrder
                .filter((ax) => groupedAnswers[ax]?.length)
                .map((axis) => (
                  <div
                    key={axis}
                    className="bg-white rounded-lg shadow-sm border"
                  >
                    <button
                      onClick={() => toggleAxis(axis)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-lg font-semibold text-gray-900">
                        {axis}
                      </span>
                      {axisOpen[axis] !== false ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                    <div
                      className={`${
                        axisOpen[axis] !== false ? "block" : "hidden"
                      } px-4 pb-4`}
                    >
                      <div className="grid grid-cols-1 gap-4">
                        {groupedAnswers[axis].map((answer) => (
                          <AnswerCard
                            key={answer._id}
                            answer={answer}
                            alternatives={
                              alternativeAnswers[answer.question._id] || []
                            }
                            showAlternatives={
                              showAlternatives[answer.question._id]
                            }
                            onToggleAlternatives={() =>
                              toggleAlternatives(answer.question._id)
                            }
                            onUpvote={(id) => handleVote(id, "upvote")}
                            onDownvote={handleDownvoteRequest}
                            votingLoading={votingLoading}
                            userVotes={userVotes}
                            user={user}
                            iconId={id}
                            iconScores={icon?.scores || {}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PoliticalCompass({ icon }) {
  // Map -100..100 to -1..1
  const clamp = (n) => Math.max(-100, Math.min(100, n || 0));
  const xNorm = clamp(icon?.scores?.equityVsFreeMarket) / 100; // left (-1) Equity to right (+1) Free Market
  const yNorm = clamp(icon?.scores?.libertarianVsAuthoritarian) / 100; // down (-1) Libertarian to up (+1) Authoritarian

  const size = 320;
  const margin = 16;
  const center = size / 2; // 160
  const radius = center - margin; // drawing radius

  const x = center + xNorm * radius;
  const y = center - yNorm * radius; // invert Y so + is up

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full md:w-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Political Compass
      </h3>
      <div className="w-full">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          {/* Quadrants */}
          <rect x="0" y="0" width={center} height={center} fill="#fee2e2" />
          <rect
            x={center}
            y="0"
            width={center}
            height={center}
            fill="#dbeafe"
          />
          <rect
            x="0"
            y={center}
            width={center}
            height={center}
            fill="#dcfce7"
          />
          <rect
            x={center}
            y={center}
            width={center}
            height={center}
            fill="#fef3c7"
          />

          {/* Grid */}
          {[...Array(8)].map((_, i) => (
            <>
              <line
                key={`v${i}`}
                x1={(size / 8) * i}
                y1="0"
                x2={(size / 8) * i}
                y2={size}
                stroke="#e5e7eb"
              />
              <line
                key={`h${i}`}
                x1="0"
                y1={(size / 8) * i}
                x2={size}
                y2={(size / 8) * i}
                stroke="#e5e7eb"
              />
            </>
          ))}

          {/* Logo watermark to match results page */}
          <image
            href="/Newiconlogo.png"
            x={center - 140}
            y={center - 140}
            width="280"
            height="280"
            opacity="0.20"
          />

          {/* Axes */}
          <line
            x1={center}
            y1="0"
            x2={center}
            y2={size}
            stroke="#6b7280"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1={center}
            x2={size}
            y2={center}
            stroke="#6b7280"
            strokeWidth="2"
          />

          {/* Position */}
          <circle
            cx={x}
            cy={y}
            r="10"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
          />
          <circle cx={x} cy={y} r="3" fill="#fff" />

          {/* Labels */}
          <text x="8" y={center - 8} fontSize="12" fill="#374151">
            Equity
          </text>
          <text
            x={size - 8}
            y={center - 8}
            fontSize="12"
            fill="#374151"
            textAnchor="end"
          >
            Free Market
          </text>
          <text
            x={center}
            y="14"
            fontSize="12"
            fill="#374151"
            textAnchor="middle"
          >
            Authoritarian
          </text>
          <text
            x={center}
            y={size - 4}
            fontSize="12"
            fill="#374151"
            textAnchor="middle"
          >
            Libertarian
          </text>
        </svg>
      </div>

      {/* Mini bars for the other 3 axes (confidence removed) */}
      {/* <div className="mt-4 space-y-2">
        {[
          ['progressiveVsConservative', 'Progressive', 'Conservative'],
          ['secularVsReligious', 'Secular', 'Religious'],
          ['globalismVsNationalism', 'Globalism', 'Nationalism'],
        ].map(([key, left, right]) => {
          const score = clamp(icon?.scores?.[key]);
          return (
            <div key={key}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{left}</span>
                <span>{right}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500`}
                  style={{ left: `${50 + (score/100)*50}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}

function AnswerCard({
  answer,
  alternatives,
  showAlternatives,
  onToggleAlternatives,
  onUpvote,
  onDownvote,
  votingLoading,
  userVotes,
  user,
  iconId,
  iconScores,
}) {
  const getAnswerColor = (answerValue) => {
    switch (answerValue) {
      case "Strongly Agree":
        return "bg-green-600 text-white";
      case "Agree":
        return "bg-green-400 text-white";
      case "Neutral":
        return "bg-gray-400 text-white";
      case "Disagree":
        return "bg-red-400 text-white";
      case "Strongly Disagree":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Recompute the primary (most confirmed) answer per question from current state
  const recomputePrimaryFromState = () => {
    // Gather all answers by question id from current primary + alternatives
    const byQ = {};
    (answers || []).forEach((a) => {
      const qid = a?.question?._id || a?.question;
      if (!qid) return;
      (byQ[qid] = byQ[qid] || []).push(a);
    });
    Object.keys(alternativeAnswers || {}).forEach((qid) => {
      (alternativeAnswers[qid] || []).forEach((a) => {
        (byQ[qid] = byQ[qid] || []).push(a);
      });
    });

    const newPrimary = [];
    const newAlts = {};
    Object.keys(byQ).forEach((qid) => {
      const list = byQ[qid];
      const sorted = [...list].sort((x, y) => {
        const ax = typeof x?.netVotes === 'number' ? x.netVotes : (x?.upvotes || 0);
        const ay = typeof y?.netVotes === 'number' ? y.netVotes : (y?.upvotes || 0);
        return ay - ax;
      });
      const best = sorted[0];
      if (best) newPrimary.push(best);
      newAlts[qid] = sorted.slice(1);
    });

    setAnswers(newPrimary);
    setAlternativeAnswers(newAlts);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {answer.question.axis}
          </span>
          <span className="text-sm text-gray-500">{answer.question.topic}</span>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {answer.question.question}
          </h3>
          <Link
            href={`/icons/${iconId}/question/${answer.question._id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
          >
            Vote to change
          </Link>
        </div>
        
      </div>

      {/* Accepted Answer */}
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getAnswerColor(
                answer.answer
              )}`}
            >
              {answer.answer}
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Confirmed by {Math.max(0, Number(answer.upvotes || 0))}
              </span>
              <button
                onClick={() => onUpvote(answer._id)}
                disabled={votingLoading[answer._id]}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors
                  ${votingLoading[answer._id]
                    ? 'bg-green-500 text-white opacity-80'
                    : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {votingLoading[answer._id] && <FaSpinner className="animate-spin mr-2" />}
                Confirm Current Answer
              </button>
            </div>
          )}
        </div>

        {/* Sources */}
        {answer.sources && answer.sources.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
            <div className="space-y-2">
              {answer.sources.map((source, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 capitalize">
                    {source.type}:
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {source.title}
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        {answer.reasoning && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Reasoning:
            </h4>
            <p className="text-sm text-gray-600">{answer.reasoning}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Submitted by {answer.submittedBy.name}
        </div>
      </div>

      {/* Alternative Answers */}
      {alternatives.length > 0 && (
        <div>
          <button
            onClick={onToggleAlternatives}
            className="text-sm text-blue-600 hover:text-blue-700 mb-3"
          >
            {showAlternatives ? "Hide" : "Show"} {alternatives.length}{" "}
            alternative answer{alternatives.length !== 1 ? "s" : ""}
          </button>

          {showAlternatives && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              {alternatives.map((alt) => (
                <div key={alt._id} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getAnswerColor(
                        alt.answer
                      )}`}
                    >
                      {alt.answer}
                    </span>
                    {user && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Confirmed by {Math.max(0, Number(alt.upvotes || 0))}
                        </span>
                        <button
                          onClick={() => onUpvote(alt._id)}
                          disabled={votingLoading[alt._id]}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors ${
                            votingLoading[alt._id]
                              ? 'bg-green-500 text-white opacity-80'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {votingLoading[alt._id] && (
                            <FaSpinner className="animate-spin mr-2" />
                          )}
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Optional: show minimal source info if present */}
                  {alt.sources && alt.sources.length > 0 && (
                    <div className="mb-2">
                      <h5 className="text-xs font-medium text-gray-700">Sources:</h5>
                      <ul className="mt-1 space-y-1">
                        {alt.sources.slice(0, 2).map((s, idx) => (
                          <li key={idx} className="text-xs text-gray-600">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-gray-600">
                    By {alt.submittedBy.name}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    )}
  </div>
);
}
