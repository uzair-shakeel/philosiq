import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { FaUser, FaPlus, FaMinus, FaCheck, FaSpinner, FaExternalLinkAlt, FaTimes, FaArrowLeft } from 'react-icons/fa';

export default function IconQuizPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { id } = router.query;
  
  const [icon, setIcon] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sources, setSources] = useState({});
  const [reasoning, setReasoning] = useState({});
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

    if (!authToken || !userEmail) {
      router.push(`/login?redirect=icons/${id}/quiz`);
      return;
    }

    setUser({
      name: userName || "",
      email: userEmail || "",
      token: authToken,
    });

    if (!id) return;
    fetchData();
  }, [id, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [iconResponse, questionsResponse] = await Promise.all([
        axios.get(`/api/icons/${id}`),
        axios.get('/api/questions/public', { params: { active: true } })
      ]);
      
      setIcon(iconResponse.data.icon);
      setQuestions(questionsResponse.data.questions);
      
      // Initialize state for all questions
      const initialSources = {};
      
      questionsResponse.data.questions.forEach(q => {
        initialSources[q._id] = [{ title: '', url: '', description: '', type: 'article' }];
      });
      
      setSources(initialSources);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        setError(`Failed to load quiz data: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        setError('Failed to load quiz data: Network error');
      } else {
        setError(`Failed to load quiz data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSourceChange = (questionId, sourceIndex, field, value) => {
    setSources(prev => ({
      ...prev,
      [questionId]: prev[questionId].map((source, index) => 
        index === sourceIndex ? { ...source, [field]: value } : source
      )
    }));
  };

  const addSource = (questionId) => {
    setSources(prev => ({
      ...prev,
      [questionId]: [...prev[questionId], { title: '', url: '', description: '', type: 'article' }]
    }));
  };

  const removeSource = (questionId, sourceIndex) => {
    setSources(prev => ({
      ...prev,
      [questionId]: prev[questionId].filter((_, index) => index !== sourceIndex)
    }));
  };

  const allQuestionsHaveSources = () => {
    return Object.keys(answers).every(questionId => {
      const questionSources = sources[questionId] || [];
      return questionSources.some(s => s.title && s.url);
    });
  };

  const handleSubmitAnswers = async () => {
    setSubmitting(true);
    setError('');

    try {
      const answersToSubmit = Object.entries(answers).map(([questionId, answer]) => ({
        iconId: id,
        questionId,
        answer,
        sources: sources[questionId].filter(s => s.title && s.url),
        reasoning: reasoning[questionId] || '',
      }));

      // Submit all answers
      await Promise.all(
        answersToSubmit.map(answerData => 
          axios.post('/api/icons/answers', answerData, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          })
        )
      );

      // Redirect to the icon profile page
      router.push(`/icons/${id}`);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  if (error && !icon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const selectedQuestion = questions.find(q => q._id === selectedQuestionId);

  return (
    <>
      <Head>
        <title>{icon ? `Quiz: ${icon.name}` : 'Icon Quiz'} - Philosiq Icons</title>
        <meta name="description" content={`Take the political quiz as ${icon?.name || 'this icon'}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/icons" className="flex items-center text-gray-600 hover:text-gray-900">
                  <FaArrowLeft className="mr-2" />
                  Back to Icons
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {icon?.imageUrl && (
                  <img 
                    src={icon.imageUrl} 
                    alt={icon.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {icon?.name || 'Loading...'}
                </h1>
                <p className="text-gray-600">
                  Answer questions as if you were {icon?.name}. Provide sources to support your answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {icon?.name?.split(' ').slice(-1)[0] || 'Icon'} vs. Free Market
                </h2>
                <div className="text-sm text-gray-600">
                  {Object.keys(answers).length} of {questions.length} questions answered
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {questions.length} questions
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                      Question
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Current Answer
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Your Answer
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question, index) => {
                    const userAnswer = answers[question._id];
                    const hasValidSources = sources[question._id]?.some(s => s.title && s.url);
                    
                    return (
                      <tr key={question._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {question.topic}
                          </div>
                          <div className="text-xs text-gray-500">
                            {question.axis}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {question.question}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            Not Set
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {userAnswer ? (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                              userAnswer === 'Strongly Agree' ? 'bg-green-600' :
                              userAnswer === 'Agree' ? 'bg-green-400' :
                              userAnswer === 'Neutral' ? 'bg-gray-400' :
                              userAnswer === 'Disagree' ? 'bg-red-400' :
                              userAnswer === 'Strongly Disagree' ? 'bg-red-600' : 'bg-gray-400'
                            }`}>
                              {userAnswer}
                            </span>
                          ) : (
                            <select
                              value={userAnswer || ''}
                              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              {answerOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {userAnswer ? (
                            <div className="flex items-center justify-center gap-2">
                              {hasValidSources ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Full Alignment
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                  Need Sources
                                </span>
                              )}
                              <button
                                onClick={() => setSelectedQuestionId(question._id)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                View Source
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Complete all questions with sources to submit
                </div>
                <button
                  onClick={handleSubmitAnswers}
                  disabled={submitting || Object.keys(answers).length !== questions.length || !allQuestionsHaveSources()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Source Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Add Sources for Question
                  </h3>
                  <button
                    onClick={() => setSelectedQuestionId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {selectedQuestion.axis}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {selectedQuestion.topic}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedQuestion.question}</p>
                  {answers[selectedQuestion._id] && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Your answer: </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                        answers[selectedQuestion._id] === 'Strongly Agree' ? 'bg-green-600' :
                        answers[selectedQuestion._id] === 'Agree' ? 'bg-green-400' :
                        answers[selectedQuestion._id] === 'Neutral' ? 'bg-gray-400' :
                        answers[selectedQuestion._id] === 'Disagree' ? 'bg-red-400' :
                        answers[selectedQuestion._id] === 'Strongly Disagree' ? 'bg-red-600' : 'bg-gray-400'
                      }`}>
                        {answers[selectedQuestion._id]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sources */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Sources (Required)</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide sources that support how {icon?.name} would answer this question.
                  </p>

                  {sources[selectedQuestion._id]?.map((source, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-900">Source {index + 1}</h5>
                        {sources[selectedQuestion._id].length > 1 && (
                          <button
                            onClick={() => removeSource(selectedQuestion._id, index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={source.title}
                            onChange={(e) => handleSourceChange(selectedQuestion._id, index, 'title', e.target.value)}
                            placeholder="e.g., Speech at Democratic Convention"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL *
                          </label>
                          <input
                            type="url"
                            value={source.url}
                            onChange={(e) => handleSourceChange(selectedQuestion._id, index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={source.type}
                            onChange={(e) => handleSourceChange(selectedQuestion._id, index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="article">Article</option>
                            <option value="book">Book</option>
                            <option value="speech">Speech</option>
                            <option value="interview">Interview</option>
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={source.description}
                            onChange={(e) => handleSourceChange(selectedQuestion._id, index, 'description', e.target.value)}
                            placeholder="Brief description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addSource(selectedQuestion._id)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FaPlus className="mr-2" />
                    Add Another Source
                  </button>
                </div>

                {/* Reasoning */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Reasoning (Optional)</h4>
                  <textarea
                    value={reasoning[selectedQuestion._id] || ''}
                    onChange={(e) => setReasoning(prev => ({ ...prev, [selectedQuestion._id]: e.target.value }))}
                    placeholder={`Explain why ${icon?.name} would answer this way...`}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedQuestionId(null)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
