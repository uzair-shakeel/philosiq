import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { 
  FaUser, FaPlus, FaMinus, FaCheck, FaSpinner, FaExternalLinkAlt, 
  FaTimes, FaArrowLeft, FaThumbsUp, FaThumbsDown, FaEdit, FaFlag 
} from 'react-icons/fa';
import Navbar from '../../../../components/Navbar';

export default function QuestionDetailPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { id, questionId } = router.query;
  
  const [icon, setIcon] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState({});
  const [error, setError] = useState('');

  // Form state for new answer submission
  const [newAnswer, setNewAnswer] = useState('');
  const [sources, setSources] = useState([{ title: '', url: '', description: '', type: 'article' }]);
  const [reasoning, setReasoning] = useState('');
  // confidence removed

  const answerOptions = [
    { value: 'Strongly Agree', label: 'Strongly Agree', color: 'bg-green-600' },
    { value: 'Agree', label: 'Agree', color: 'bg-green-400' },
    { value: 'Neutral', label: 'Neutral', color: 'bg-gray-400' },
    { value: 'Disagree', label: 'Disagree', color: 'bg-red-400' },
    { value: 'Strongly Disagree', label: 'Strongly Disagree', color: 'bg-red-600' },
  ];

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

    if (!id || !questionId) return;
    fetchData();
  }, [id, questionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [iconResponse, answersResponse] = await Promise.all([
        axios.get(`/api/icons/${id}`),
        axios.get('/api/icons/answers', { 
          params: { 
            iconId: id, 
            questionId: questionId,
            includeAlternatives: true 
          } 
        })
      ]);
      
      setIcon(iconResponse.data.icon);
      setAnswers(answersResponse.data.answers);
      
      // Get the question from the first answer
      if (answersResponse.data.answers.length > 0) {
        setQuestion(answersResponse.data.answers[0].question);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load question data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (answerId, voteType) => {
    if (!user) {
      router.push(`/login?redirect=icons/${id}/question/${questionId}`);
      return;
    }

    setVoting(prev => ({ ...prev, [answerId]: true }));

    try {
      const response = await axios.post('/api/icons/answers/vote', {
        answerId,
        voteType,
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

      // Update user votes
      setUserVotes(prev => ({
        ...prev,
        [answerId]: voteType
      }));

    } catch (error) {
      console.error('Voting error:', error);
      setError('Failed to record vote');
    } finally {
      setVoting(prev => ({ ...prev, [answerId]: false }));
    }
  };

  const handleSourceChange = (sourceIndex, field, value) => {
    setSources(prev => prev.map((source, index) => 
      index === sourceIndex ? { ...source, [field]: value } : source
    ));
  };

  const addSource = () => {
    setSources(prev => [...prev, { title: '', url: '', description: '', type: 'article' }]);
  };

  const removeSource = (sourceIndex) => {
    setSources(prev => prev.filter((_, index) => index !== sourceIndex));
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      router.push(`/login?redirect=icons/${id}/question/${questionId}`);
      return;
    }

    if (!newAnswer || !sources.some(s => s.title && s.url)) {
      setError('Please provide an answer and at least one source');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/icons/answers', {
        iconId: id,
        questionId: questionId,
        answer: newAnswer,
        sources: sources.filter(s => s.title && s.url),
        reasoning,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      // Reset form and refresh data
      setNewAnswer('');
      setSources([{ title: '', url: '', description: '', type: 'article' }]);
      setReasoning('');
      // confidence removed
      setShowSubmitForm(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAnswerColor = (answer) => {
    const option = answerOptions.find(opt => opt.value === answer);
    return option ? option.color : 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!icon || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
          <Link href={`/icons/${id}`} className="text-blue-600 hover:text-blue-800">
            Back to Icon Profile
          </Link>
        </div>
      </div>
    );
  }

  const acceptedAnswer = answers.find(a => a.isAccepted);
  const alternativeAnswers = answers.filter(a => !a.isAccepted).sort((a, b) => b.netVotes - a.netVotes);

  return (
    <>
      <Head>
        <title>{`${question.question} - ${icon.name} - Philosiq Icons`}</title>
        <meta name="description" content={`Community answers for how ${icon.name} would respond to: ${question.question}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />

        {/* Header */}
        <div className="bg-white shadow-sm border-b mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4">
              <Link href={`/icons/${id}`} className="flex items-center text-gray-600 hover:text-gray-900 w-fit">
                <FaArrowLeft className="mr-2" />
                Back to {icon.name}
              </Link>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {icon.imageUrl && (
                  <img 
                    src={icon.imageUrl} 
                    alt={icon.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{icon.name}</h1>
                <p className="text-gray-600">{icon.occupation}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {question.axis}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {question.topic}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{question.question}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Current Accepted Answer */}
          {acceptedAnswer && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Answer</h3>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getAnswerColor(acceptedAnswer.answer)}`}>
                      {acceptedAnswer.answer}
                    </span>
                    {/* confidence removed */}
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Accepted
                    </span>
                  </div>
                  
                  {user && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(acceptedAnswer._id, 'upvote')}
                        disabled={voting[acceptedAnswer._id]}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                          userVotes[acceptedAnswer._id] === 'upvote'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <FaThumbsUp />
                        {acceptedAnswer.upvotes}
                      </button>
                      <button
                        onClick={() => handleVote(acceptedAnswer._id, 'downvote')}
                        disabled={voting[acceptedAnswer._id]}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                          userVotes[acceptedAnswer._id] === 'downvote'
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <FaThumbsDown />
                        {acceptedAnswer.downvotes}
                      </button>
                    </div>
                  )}
                </div>

                {acceptedAnswer.reasoning && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
                    <p className="text-gray-700">{acceptedAnswer.reasoning}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                  <div className="space-y-2">
                    {acceptedAnswer.sources.map((source, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {source.type}
                        </span>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {source.title}
                          <FaExternalLinkAlt className="h-3 w-3" />
                        </a>
                        {source.description && (
                          <span className="text-gray-600">- {source.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alternative Answers */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alternative Answers ({alternativeAnswers.length})
              </h3>
              {user && (
                <button
                  onClick={() => setShowSubmitForm(!showSubmitForm)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Submit Alternative
                </button>
              )}
            </div>

            {alternativeAnswers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-600">No alternative answers yet. Be the first to disagree!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alternativeAnswers.map((answer) => (
                  <div key={answer._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getAnswerColor(answer.answer)}`}>
                          {answer.answer}
                        </span>
                        {/* confidence removed */}
                        <span className="text-xs text-gray-500">
                          Net votes: {answer.netVotes}
                        </span>
                      </div>
                      
                      {user && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(answer._id, 'upvote')}
                            disabled={voting[answer._id]}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                              userVotes[answer._id] === 'upvote'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:text-green-600'
                            }`}
                          >
                            <FaThumbsUp />
                            {answer.upvotes}
                          </button>
                          <button
                            onClick={() => handleVote(answer._id, 'downvote')}
                            disabled={voting[answer._id]}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
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

                    {answer.reasoning && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
                        <p className="text-gray-700">{answer.reasoning}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                      <div className="space-y-2">
                        {answer.sources.map((source, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {source.type}
                            </span>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              {source.title}
                              <FaExternalLinkAlt className="h-3 w-3" />
                            </a>
                            {source.description && (
                              <span className="text-gray-600">- {source.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Form */}
          {showSubmitForm && user && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Submit Alternative Answer</h3>
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Answer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would {icon.name} answer this question?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {answerOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewAnswer(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newAnswer === option.value
                            ? `${option.color} text-white border-transparent`
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sources (Required)
                  </label>
                  {sources.map((source, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Source {index + 1}</h4>
                        {sources.length > 1 && (
                          <button
                            onClick={() => removeSource(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <input
                          type="text"
                          placeholder="Source title"
                          value={source.title}
                          onChange={(e) => handleSourceChange(index, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="url"
                          placeholder="Source URL"
                          value={source.url}
                          onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                          value={source.type}
                          onChange={(e) => handleSourceChange(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="article">Article</option>
                          <option value="book">Book</option>
                          <option value="speech">Speech</option>
                          <option value="interview">Interview</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Brief description"
                          value={source.description}
                          onChange={(e) => handleSourceChange(index, 'description', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addSource}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FaPlus className="mr-2" />
                    Add Another Source
                  </button>
                </div>

                {/* Reasoning */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reasoning (Optional)
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder={`Explain why ${icon.name} would answer this way...`}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Confidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence: {confidence}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSubmitForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !newAnswer || !sources.some(s => s.title && s.url)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && <FaSpinner className="animate-spin" />}
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
