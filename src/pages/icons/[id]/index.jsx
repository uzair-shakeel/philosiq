import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { 
  FaUser, FaCalendar, FaGlobe, FaExternalLinkAlt, FaThumbsUp, FaThumbsDown, 
  FaSpinner, FaQuestionCircle, FaChevronDown, FaChevronUp, FaArrowLeft, 
  FaEdit, FaTimes
} from 'react-icons/fa';
import Navbar from '../../../components/Navbar';

export default function IconProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { id } = router.query;
  
  const [icon, setIcon] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [alternativeAnswers, setAlternativeAnswers] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState({});
  const [showAlternatives, setShowAlternatives] = useState({});
  const [error, setError] = useState('');
  // throttle duplicate vote clicks and collect counter-evidence for downvotes
  const [lastVoteAt, setLastVoteAt] = useState({});
  const [counterModal, setCounterModal] = useState({ open: false, answerId: null, title: '', url: '', description: '' });
  const [axisOpen, setAxisOpen] = useState({});

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
        axios.get('/api/icons/answers', { 
          params: { iconId: id, includeAlternatives: true } 
        })
      ]);
      
      setIcon(iconResponse.data.icon);
      
      // Separate accepted and alternative answers
      const acceptedAnswers = answersResponse.data.answers.filter(a => a.isAccepted);
      const alternatives = {};
      
      answersResponse.data.answers.forEach(answer => {
        if (!answer.isAccepted) {
          if (!alternatives[answer.question._id]) {
            alternatives[answer.question._id] = [];
          }
          alternatives[answer.question._id].push(answer);
        }
      });
      
      setAnswers(acceptedAnswers);
      setAlternativeAnswers(alternatives);
      
      // If user is logged in, fetch their votes
      if (user) {
        // This would require a separate API endpoint to get user votes
        // For now, we'll implement voting without pre-loading user votes
      }
    } catch (error) {
      console.error('Error fetching icon data:', error);
      setError('Failed to load icon data');
    } finally {
      setLoading(false);
    }
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
    if (voteType === 'downvote' && !counterEvidence) {
      setCounterModal({ open: true, answerId, title: '', url: '', description: '' });
      return;
    }

    setVotingLoading(prev => ({ ...prev, [answerId]: true }));

    try {
      const response = await axios.post('/api/icons/answers/vote', {
        answerId,
        voteType,
        counterEvidence,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the answer in state
      setAnswers(prev => prev.map(answer => 
        answer._id === answerId 
          ? { ...answer, ...response.data.answer }
          : answer
      ));

      // Update alternative answers if needed
      setAlternativeAnswers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(questionId => {
          updated[questionId] = updated[questionId].map(answer =>
            answer._id === answerId 
              ? { ...answer, ...response.data.answer }
              : answer
          );
        });
        return updated;
      });

      // Update user votes tracking from server-confirmed state
      const serverType = response.data?.currentVoteType || voteType;
      setUserVotes(prev => ({ ...prev, [answerId]: serverType }));
      setLastVoteAt(prev => ({ ...prev, [answerId]: now }));

    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingLoading(prev => ({ ...prev, [answerId]: false }));
    }
  };

  const handleDownvoteRequest = (answerId) => {
    // If user has already submitted an alternative on this question, allow direct downvote
    const qid = findQuestionIdByAnswerId(answerId);
    if (qid && hasUserAlternativeForQuestion(qid)) {
      handleVote(answerId, 'downvote', { title: 'user-submitted-alternative', url: 'about:blank', description: 'Auto-allowed (has alternative)' });
      return;
    }
    // Otherwise fall back to counter-evidence modal
    handleVote(answerId, 'downvote');
  };

  const submitCounterEvidence = async () => {
    const { answerId, title, url, description } = counterModal;
    if (!answerId || !title.trim() || !url.trim()) return;
    await handleVote(answerId, 'downvote', { title: title.trim(), url: url.trim(), description: (description || '').trim() });
    setCounterModal({ open: false, answerId: null, title: '', url: '', description: '' });
  };

  const closeCounterModal = () => setCounterModal({ open: false, answerId: null, title: '', url: '', description: '' });

  const toggleAlternatives = (questionId) => {
    setShowAlternatives(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Determine if current user has already submitted any alternative for the given question
  const hasUserAlternativeForQuestion = (questionId) => {
    if (!user) return false;
    const alts = alternativeAnswers[questionId] || [];
    return alts.some((alt) => {
      const sb = alt.submittedBy;
      // submittedBy may be a string (email/id) or an object with email
      if (typeof sb === 'string') {
        return sb === user.email || sb === user.name;
      }
      if (sb && typeof sb === 'object') {
        return sb.email === user.email || sb.name === user.name || sb.id === user.email;
      }
      return false;
    });
  };

  // Find the questionId owning a given answerId (search accepted and alternatives)
  const findQuestionIdByAnswerId = (answerId) => {
    const acc = answers.find(a => a._id === answerId);
    if (acc) return acc.question._id;
    for (const qid of Object.keys(alternativeAnswers)) {
      const hit = (alternativeAnswers[qid] || []).find(a => a._id === answerId);
      if (hit) return qid;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !icon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Icon not found'}
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
    'Equity vs. Free Market',
    'Libertarian vs. Authoritarian',
    'Progressive vs. Conservative',
    'Secular vs. Religious',
    'Globalism vs. Nationalism',
  ];
  const groupedAnswers = answers.reduce((acc, a) => {
    const ax = a.question.axis;
    (acc[ax] = acc[ax] || []).push(a);
    return acc;
  }, {});
  // Toggle: if undefined (initial), first click collapses (sets false). Thereafter toggles boolean.
  const toggleAxis = (axis) => setAxisOpen(prev => {
    const current = prev[axis];
    const next = current === undefined ? false : !current;
    return { ...prev, [axis]: next };
  });

  return (
    <>
      <Head>
        <title>{icon.name} - Political Profile - Philosiq Icons</title>
        <meta name="description" content={`Political compass profile of ${icon.name} based on community research`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-4">
              <Link href="/icons" className="flex items-center text-gray-600 hover:text-gray-900 w-fit">
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
                    className="w-48 h-60 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-48 h-60 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                    <FaUser className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{icon.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{icon.occupation}</p>
                
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
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {icon.description}
                </p>

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
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(icon.wikipediaTitle)}`}
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
              <div className="flex-shrink-0">
                <PoliticalCompass icon={icon} />
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Political Positions</h2>
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
              {axisOrder.filter(ax => groupedAnswers[ax]?.length).map((axis) => (
                <div key={axis} className="bg-white rounded-lg shadow-sm border">
                  <button
                    onClick={() => toggleAxis(axis)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">{axis}</span>
                    {((axisOpen[axis] !== false)) ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                  </button>
                  <div className={`${(axisOpen[axis] !== false) ? 'block' : 'hidden'} px-4 pb-4`}>
                    <div className="grid grid-cols-1 gap-4">
                      {groupedAnswers[axis].map((answer) => (
                        <AnswerCard
                          key={answer._id}
                          answer={answer}
                          alternatives={alternativeAnswers[answer.question._id] || []}
                          showAlternatives={showAlternatives[answer.question._id]}
                          onToggleAlternatives={() => toggleAlternatives(answer.question._id)}
                          onUpvote={(id) => handleVote(id, 'upvote')}
                          onDownvote={handleDownvoteRequest}
                          votingLoading={votingLoading}
                          userVotes={userVotes}
                          user={user}
                          iconId={id}
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
  const xNorm = (clamp(icon?.scores?.equityVsFreeMarket) / 100); // left (-1) Equity to right (+1) Free Market
  const yNorm = (clamp(icon?.scores?.libertarianVsAuthoritarian) / 100); // down (-1) Libertarian to up (+1) Authoritarian

  const size = 320;
  const margin = 16;
  const center = size / 2; // 160
  const radius = center - margin; // drawing radius

  const x = center + xNorm * radius;
  const y = center - yNorm * radius; // invert Y so + is up

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full md:w-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Political Compass</h3>
      <div className="w-full">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          {/* Quadrants */}
          <rect x="0" y="0" width={center} height={center} fill="#fee2e2" />
          <rect x={center} y="0" width={center} height={center} fill="#dbeafe" />
          <rect x="0" y={center} width={center} height={center} fill="#dcfce7" />
          <rect x={center} y={center} width={center} height={center} fill="#fef3c7" />

          {/* Grid */}
          {[...Array(8)].map((_, i) => (
            <>
              <line key={`v${i}`} x1={(size/8)*i} y1="0" x2={(size/8)*i} y2={size} stroke="#e5e7eb" />
              <line key={`h${i}`} x1="0" y1={(size/8)*i} x2={size} y2={(size/8)*i} stroke="#e5e7eb" />
            </>
          ))}

          {/* Axes */}
          <line x1={center} y1="0" x2={center} y2={size} stroke="#6b7280" strokeWidth="2" />
          <line x1="0" y1={center} x2={size} y2={center} stroke="#6b7280" strokeWidth="2" />

          {/* Position */}
          <circle cx={x} cy={y} r="10" fill="#2563eb" stroke="#1d4ed8" strokeWidth="3" />
          <circle cx={x} cy={y} r="3" fill="#fff" />

          {/* Labels */}
          <text x="8" y={center-8} fontSize="12" fill="#374151">Equity</text>
          <text x={size-8} y={center-8} fontSize="12" fill="#374151" textAnchor="end">Free Market</text>
          <text x={center} y="14" fontSize="12" fill="#374151" textAnchor="middle">Authoritarian</text>
          <text x={center} y={size-4} fontSize="12" fill="#374151" textAnchor="middle">Libertarian</text>
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
  iconId
}) {
  const getAnswerColor = (answerValue) => {
    switch (answerValue) {
      case 'Strongly Agree': return 'bg-green-600 text-white';
      case 'Agree': return 'bg-green-400 text-white';
      case 'Neutral': return 'bg-gray-400 text-white';
      case 'Disagree': return 'bg-red-400 text-white';
      case 'Strongly Disagree': return 'bg-red-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {answer.question.axis}
          </span>
          <span className="text-sm text-gray-500">
            {answer.question.topic}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {answer.question.question}
          </h3>
          <Link 
            href={`/icons/${iconId}/question/${answer.question._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Accepted Answer */}
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAnswerColor(answer.answer)}`}>
              {answer.answer}
            </span>
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpvote(answer._id)}
                disabled={votingLoading[answer._id]}
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                  userVotes[answer._id] === 'upvote'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {votingLoading[answer._id] ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaThumbsUp />
                )}
                {answer.upvotes}
              </button>
              
              <button
                onClick={() => onDownvote(answer._id)}
                disabled={votingLoading[answer._id]}
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                  userVotes[answer._id] === 'downvote'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FaThumbsDown />
                {answer.downvotes}
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
                  <span className="text-gray-600 capitalize">{source.type}:</span>
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
            <h4 className="text-sm font-medium text-gray-700 mb-1">Reasoning:</h4>
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
            {showAlternatives ? 'Hide' : 'Show'} {alternatives.length} alternative answer{alternatives.length !== 1 ? 's' : ''}
          </button>

          {showAlternatives && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              {alternatives.map((alt) => (
                <div key={alt._id} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAnswerColor(alt.answer)}`}>
                      {alt.answer}
                    </span>
                    
                    {user && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpvote(alt._id)}
                          disabled={votingLoading[alt._id]}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                            userVotes[alt._id] === 'upvote'
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:text-green-600'
                          }`}
                        >
                          <FaThumbsUp />
                          {alt.upvotes}
                        </button>
                        
                        <button
                          onClick={() => onDownvote(alt._id)}
                          disabled={votingLoading[alt._id]}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                            userVotes[alt._id] === 'downvote'
                              ? 'bg-red-100 text-red-700'
                              : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <FaThumbsDown />
                          {alt.downvotes}
                        </button>
                      </div>
                    )}
                  </div>
                  
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
