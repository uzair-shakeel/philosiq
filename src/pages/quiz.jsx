import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AuthModal from "../components/AuthModal";
import {
  FaArrowRight,
  FaArrowLeft,
  FaClipboardList,
  FaClipboardCheck,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { track } from "@vercel/analytics";
import { useRouter } from "next/router";
import { calculateResults } from "../utils/resultsCalculator";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showingAxes, setShowingAxes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
    }
  }, []);

  // Fallback questions in case the API fails
  const FALLBACK_QUESTIONS = [
    {
      _id: "fallback1",
      question:
        "The government should provide universal healthcare for all citizens.",
      axis: "Equity vs. Free Market",
      direction: "Left",
      weight: 1,
    },
    {
      _id: "fallback2",
      question:
        "Private businesses should be able to operate with minimal government regulation.",
      axis: "Equity vs. Free Market",
      direction: "Right",
      weight: 1,
    },
    {
      _id: "fallback3",
      question:
        "Individual freedoms should be prioritized over national security concerns.",
      axis: "Libertarian vs. Authoritarian",
      direction: "Left",
      weight: 1,
    },
    {
      _id: "fallback4",
      question:
        "Strong government authority is necessary to maintain social order.",
      axis: "Libertarian vs. Authoritarian",
      direction: "Right",
      weight: 1,
    },
    {
      _id: "fallback5",
      question: "Society should embrace progressive social changes.",
      axis: "Progressive vs. Conservative",
      direction: "Left",
      weight: 1,
    },
    {
      _id: "fallback6",
      question: "Traditional values and customs should be preserved.",
      axis: "Progressive vs. Conservative",
      direction: "Right",
      weight: 1,
    },
    {
      _id: "fallback7",
      question: "Religion should be kept separate from government policy.",
      axis: "Secular vs. Religious",
      direction: "Left",
      weight: 1,
    },
    {
      _id: "fallback8",
      question: "Religious principles should guide government decisions.",
      axis: "Secular vs. Religious",
      direction: "Right",
      weight: 1,
    },
    {
      _id: "fallback9",
      question:
        "International cooperation should be prioritized over national interests.",
      axis: "Globalism vs. Nationalism",
      direction: "Left",
      weight: 1,
    },
    {
      _id: "fallback10",
      question:
        "A country should prioritize its own citizens' needs over global concerns.",
      axis: "Globalism vs. Nationalism",
      direction: "Right",
      weight: 1,
    },
  ];

  // Function to fetch questions from the API
  const fetchQuestions = async (limit, includeInShortQuiz = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the public endpoint instead of the authenticated one
      const url = `/api/questions/public?limit=${limit}&includeInShortQuiz=${includeInShortQuiz}`;
      console.log(`Fetching questions from: ${url}`);

      const response = await axios.get(url);

      if (response.data.success) {
        console.log(
          `Successfully fetched ${response.data.questions.length} questions`
        );
        return response.data.questions || [];
      } else {
        console.error("API returned success: false", response.data);
        throw new Error(response.data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(
        `Failed to load questions from API: ${
          error.message || "Unknown error"
        }. Using fallback questions.`
      );

      // Return fallback questions if API fails
      if (includeInShortQuiz) {
        // For short quiz, return all fallback questions
        return FALLBACK_QUESTIONS;
      } else {
        // For full quiz, duplicate the fallback questions to get more
        const duplicatedQuestions = [];
        for (let i = 0; i < 10; i++) {
          duplicatedQuestions.push(
            ...FALLBACK_QUESTIONS.map((q) => ({ ...q, _id: `${q._id}_${i}` }))
          );
        }
        return duplicatedQuestions;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all questions without any filtering
  const fetchAllQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `/api/questions/all`;
      console.log(`Fetching all questions from: ${url}`);

      const response = await axios.get(url);

      if (response.data.success) {
        console.log(
          `Successfully fetched ${response.data.questions.length} questions`
        );
        return response.data.questions || [];
      } else {
        console.error("API returned success: false", response.data);
        throw new Error(response.data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching all questions:", error);
      setError(
        `Failed to load questions from API: ${
          error.message || "Unknown error"
        }. Using fallback questions.`
      );

      // Return fallback questions if API fails
      const duplicatedQuestions = [];
      for (let i = 0; i < 10; i++) {
        duplicatedQuestions.push(
          ...FALLBACK_QUESTIONS.map((q) => ({ ...q, _id: `${q._id}_${i}` }))
        );
      }
      return duplicatedQuestions;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Function to start the quiz
  const startQuiz = async (type) => {
    // Removed authentication check so users can start the quiz without logging in
    // if (!isAuthenticated) {
    //   setShowAuthModal(true);
    //   return;
    // }

    // Track quiz start event
    track("quiz_started", { type });

    setQuizType(type);
    setIsLoading(true);

    try {
      let fetchedQuestions = [];

      if (type === "short") {
        // For short quiz, fetch questions marked for inclusion in the short quiz
        const allQuestions = await fetchQuestions(200, true);

        if (allQuestions.length === 0) {
          setError("Not enough questions available. Please try again later.");
          setIsLoading(false);
          return;
        }

        // Group questions by axis
        const questionsByAxis = {};
        allQuestions.forEach((question) => {
          // All questions should already be marked for short quiz from the API
          if (!questionsByAxis[question.axis]) {
            questionsByAxis[question.axis] = [];
          }
          questionsByAxis[question.axis].push(question);
        });

        // Get axes available
        const axes = Object.keys(questionsByAxis);

        if (axes.length === 0) {
          setError(
            "No questions marked for short quiz found. Please contact administrator."
          );
          setIsLoading(false);
          return;
        }

        // Calculate how many questions to take from each axis
        // We want 30 questions total, distributed evenly
        const questionsPerAxis = Math.floor(30 / axes.length);

        // Select questions from each axis
        let selectedQuestions = [];
        axes.forEach((axis) => {
          const axisQuestions = questionsByAxis[axis];
          // If we have more questions than needed, shuffle and take the required number
          if (axisQuestions.length > questionsPerAxis) {
            const shuffled = shuffleArray([...axisQuestions]);
            selectedQuestions = [
              ...selectedQuestions,
              ...shuffled.slice(0, questionsPerAxis),
            ];
          } else {
            // If we don't have enough, take all available
            selectedQuestions = [...selectedQuestions, ...axisQuestions];
          }
        });

        // If we still need more questions to reach 30, take from any axis
        if (selectedQuestions.length < 30) {
          // Create a pool of all remaining questions
          const remainingQuestions = [];
          axes.forEach((axis) => {
            const axisQuestions = questionsByAxis[axis];
            const alreadySelected = selectedQuestions.filter(
              (q) => q.axis === axis
            ).length;
            if (axisQuestions.length > alreadySelected) {
              const notSelected = axisQuestions.filter(
                (q) =>
                  !selectedQuestions.some((selected) => selected._id === q._id)
              );
              remainingQuestions.push(...notSelected);
            }
          });

          // Shuffle and take what we need
          if (remainingQuestions.length > 0) {
            const shuffled = shuffleArray(remainingQuestions);
            const needed = 30 - selectedQuestions.length;
            selectedQuestions = [
              ...selectedQuestions,
              ...shuffled.slice(0, needed),
            ];
          }
        }

        // Final shuffle to mix questions from different axes
        fetchedQuestions = shuffleArray(selectedQuestions);
      } else {
        // For full quiz, fetch all questions without any filtering
        const allQuestions = await fetchAllQuestions();

        if (allQuestions.length === 0) {
          setError("Not enough questions available. Please try again later.");
          setIsLoading(false);
          return;
        }

        // Remove duplicates by question text
        const uniqueQuestions = Array.from(
          new Map(allQuestions.map((q) => [q.question, q])).values()
        );

        // Use all unique questions without limiting them
        fetchedQuestions = shuffleArray(uniqueQuestions);
      }

      if (fetchedQuestions.length === 0) {
        setError("Not enough questions available. Please try again later.");
        setIsLoading(false);
        return;
      }

      // Set the questions and start the quiz
      setQuestions(fetchedQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      setError("Failed to start quiz. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion]?._id]: value,
    });

    // Only auto-advance if not on the last question
    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);

      // Wait for transition animation before changing question
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Get the auth token
      // const token = localStorage.getItem("authToken");
      // if (!token) {
      //   throw new Error("Please log in to save your results");
      // }

      // Calculate final results using the proper utility
      const finalResults = calculateResults(questions, answers);
      console.log("Final Results:", finalResults); // Debug log

      // Save results to session storage
      const resultsData = {
        questions,
        answers,
        // Save detailed axis information
        axisBreakdown: finalResults.axisResults,
        axisScores: finalResults.axisScores,
        // Save primary archetype
        archetype: finalResults.archetype,
        // Include secondary archetypes if available
        secondaryArchetypes: finalResults.secondaryArchetypes || [],
        timestamp: new Date().toISOString(),
        quizType: quizType === "short" ? "short" : "full",
      };

      console.log("Saving Results Data:", resultsData); // Debug log

      sessionStorage.setItem("quizResults", JSON.stringify(resultsData));
      localStorage.setItem("quizResults", JSON.stringify(resultsData));

      // If user is authenticated, save to database

      // Navigate to results page
      router.push("/results");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionError(error.message);

      // Track submission error
      track("quiz_submission_error", {
        error: error.message,
        quizType: quizType === "short" ? "short" : "full",
      });

      setIsSubmitting(false);
    }
  };

  const toggleAxesDisplay = () => {
    setShowingAxes(!showingAxes);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // Show loading state
  if (isLoading) {
    return (
      <Layout title="Loading Quiz - Philosiq">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Loading Quiz</h2>
            <p className="text-gray-600">
              Please wait while we prepare your questions...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error && !quizStarted) {
    return (
      <Layout title="Quiz Error - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Error Loading Quiz</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-maroon hover:bg-primary-darkMaroon text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Political Quiz - PhilosiQ">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {!quizStarted ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                  Discover Your Political Archetype
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Take our quiz to understand where you stand on the political
                  spectrum
                </p>
                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
                    <p className="text-blue-700 flex items-center">
                      <FaUser className="mr-2" />
                      Please sign in to save your results
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Short Quiz Option */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-secondary-darkBlue text-white p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Short Quiz</h2>
                      <FaClipboardList className="text-3xl" />
                    </div>
                    <p className="text-sm opacity-90">
                      30 questions • ~10 minutes
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      Get a fast, high-level snapshot of your political leanings
                      in just a few minutes. This short quiz may yield more
                      extreme results, as it determines your ideology based on
                      only a few questions. Take the full quiz when you have
                      more time!
                    </p>
                    <button
                      onClick={() => startQuiz("short")}
                      className="w-full bg-secondary-darkBlue hover:bg-secondary-blue text-white font-bold py-3 px-4 rounded transition-colors duration-300"
                    >
                      Start Short Quiz
                    </button>
                  </div>
                </div>

                {/* Full Quiz Option */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-primary-maroon text-white p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Full Quiz</h2>
                      <FaClipboardCheck className="text-3xl" />
                    </div>
                    <p className="text-sm opacity-90">
                      88 questions • ~25 minutes
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      Explore the full spectrum of your political beliefs with
                      our comprehensive, in-depth test. This full quiz provides
                      the most accurate results by covering a broad range of key
                      topics across the ideological spectrum.
                    </p>
                    <button
                      onClick={() => startQuiz("full")}
                      className="w-full bg-primary-maroon hover:bg-primary-darkMaroon text-white font-bold py-3 px-4 rounded transition-colors duration-300"
                    >
                      Start Full Quiz
                    </button>
                  </div>
                </div>
              </div>

              {/* Political Axes Information Section */}
              <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    Political Axes Explained
                  </h2>
                  <button
                    onClick={toggleAxesDisplay}
                    className="px-4 py-2 bg-secondary-darkBlue hover:bg-secondary-blue text-white rounded transition-colors duration-300"
                  >
                    {showingAxes ? "Hide Details" : "Show Details"}
                  </button>
                </div>

                <p className="text-gray-600 mb-4">
                  This quiz measures your political position across five
                  fundamental axes. Each represents a key dimension of political
                  thought.
                </p>

                {showingAxes && (
                  <div className="space-y-6 mt-6">
                    {/* Economic Axis */}
                    <div className="border-b pb-6">
                      <h3 className="text-xl font-semibold mb-2 text-primary-maroon">
                        Economic Equity vs. Free Market
                      </h3>
                      <p className="text-gray-700">
                        The Economic Equity vs. Free Market axis represents the
                        fundamental debate between government intervention to
                        reduce economic disparities and the belief that free
                        markets generate the most prosperity. On one end, the
                        Economic Equity perspective argues that systemic
                        inequalities require state intervention, such as
                        progressive taxation, social welfare programs, labor
                        protections, and public funding of essential services
                        like education and healthcare. Supporters of this view
                        believe that economic systems should prioritize reducing
                        wealth concentration and ensuring that all individuals,
                        regardless of background, have equal opportunities. On
                        the other end, the Free Market perspective champions
                        minimal government interference, arguing that
                        capitalism, entrepreneurship, and competition naturally
                        drive innovation and economic growth. Advocates believe
                        that market forces, rather than state control, should
                        dictate wages, industry regulations, and social
                        policies, as excessive intervention can stifle
                        productivity and individual ambition. This axis
                        ultimately reflects a long-standing ideological divide:
                        Should the government play an active role in
                        redistributing wealth and regulating markets, or should
                        individuals and businesses be left to operate with
                        minimal restrictions, even if it results in greater
                        economic inequality?
                      </p>
                    </div>

                    {/* Liberty Axis */}
                    <div className="border-b pb-6">
                      <h3 className="text-xl font-semibold mb-2 text-secondary-darkBlue">
                        Libertarian vs. Authoritarian
                      </h3>
                      <p className="text-gray-700">
                        The Libertarian vs. Authoritarian axis centers around
                        the balance between personal freedoms and government
                        authority. On the Libertarian end, there is a strong
                        emphasis on individual rights, with the belief that
                        government should interfere as little as possible in the
                        lives of its citizens. This view advocates for the
                        protection of civil liberties such as freedom of speech,
                        the right to protest, and the ability to make personal
                        choices, such as the legalization of recreational drugs.
                        Libertarians argue that citizens should be free to
                        express dissent and engage in activities that do not
                        harm others, even if these actions disrupt social order.
                        In contrast, the Authoritarian perspective supports a
                        strong, centralized government that prioritizes national
                        security, social order, and political stability.
                        Authoritarians argue that government surveillance,
                        censorship, and even the suspension of civil liberties
                        in times of crisis are necessary to protect the public
                        and maintain control. They support a more powerful state
                        with the authority to regulate and oversee various
                        aspects of life, including education, media, and
                        national culture, to ensure social cohesion and unity.
                        This axis raises critical questions about the role of
                        government: Should personal freedoms be protected above
                        all else, or should the government be granted broader
                        powers to safeguard security, stability, and national
                        interests, even at the expense of individual rights?
                      </p>
                    </div>

                    {/* Social Axis */}
                    <div className="border-b pb-6">
                      <h3 className="text-xl font-semibold mb-2 text-primary-maroon">
                        Progressive vs. Conservative
                      </h3>
                      <p className="text-gray-700">
                        The Progressive vs. Conservative axis represents the
                        ideological divide between embracing societal change and
                        preserving long-standing traditions. On one end, the
                        Progressive perspective advocates for rapid social
                        evolution, embracing cultural shifts, technological
                        advancements, and modern values, even if they challenge
                        established norms. Progressives prioritize inclusivity,
                        adaptation, and innovation, believing that society
                        should continuously evolve to address new challenges and
                        reflect contemporary moral, economic, and social
                        realities. They argue that education, government
                        policies, and social structures should be updated to
                        promote equality, environmental sustainability, and
                        cultural diversity. On the other end, the Conservative
                        perspective emphasizes the importance of stability,
                        tradition, and continuity. Conservatives believe that
                        preserving cultural heritage, traditional family
                        structures, and moral values is essential for
                        maintaining social order and national identity. They
                        argue that rapid change can lead to instability, and
                        that customs, religious principles, and historical
                        lessons provide a strong foundation for a functioning
                        society. This axis ultimately reflects a key question:
                        Should society prioritize innovation, inclusivity, and
                        transformation, or should it focus on maintaining
                        established traditions and values as the cornerstone of
                        stability?
                      </p>
                    </div>

                    {/* Religion Axis */}
                    <div className="border-b pb-6">
                      <h3 className="text-xl font-semibold mb-2 text-secondary-darkBlue">
                        Secular vs. Religious
                      </h3>
                      <p className="text-gray-700">
                        The Secular vs. Religious axis explores the role of
                        religion in governance, society, and morality. On one
                        end, the Secular perspective argues that government and
                        public institutions should remain entirely separate from
                        religious influence, ensuring that laws and policies are
                        based on reason, science, and universal human rights
                        rather than religious doctrine. Secularists believe that
                        morality can be derived from humanistic principles, that
                        public funding should not support religious
                        organizations, and that no religion should have a
                        privileged role in shaping public policy. They also
                        advocate for religious neutrality in schools and
                        government spaces to maintain inclusivity and fairness.
                        On the other end, the Religious perspective holds that
                        religious values provide a necessary moral foundation
                        for society and should play a guiding role in
                        governance, education, and public life. Supporters of
                        this view argue that religious institutions should be
                        protected from laws that contradict their beliefs, that
                        faith-based teachings instill essential ethical values,
                        and that national identity is often rooted in religious
                        traditions. This axis ultimately reflects a fundamental
                        question: Should society be governed by secular
                        principles that prioritize neutrality and reason, or
                        should religious traditions and moral teachings be
                        central to shaping laws, policies, and cultural
                        identity?
                      </p>
                    </div>

                    {/* International Axis */}
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-primary-maroon">
                        Globalism vs. Nationalism
                      </h3>
                      <p className="text-gray-700">
                        The Globalism vs. Nationalism axis examines the balance
                        between prioritizing international cooperation and
                        maintaining strong national sovereignty. On one end, the
                        Globalist perspective emphasizes international
                        collaboration, open borders, and cultural exchange.
                        Globalists argue that solving issues like climate
                        change, economic stability, and security requires
                        cooperation with other nations, even if it means
                        compromising some national policies. They support free
                        trade, foreign aid, and diplomatic efforts over military
                        intervention, believing that global interconnectedness
                        leads to prosperity and peace. On the other end, the
                        Nationalist perspective prioritizes national
                        sovereignty, self-sufficiency, and cultural
                        preservation. Nationalists argue that strong borders,
                        military strength, and economic independence are
                        essential for security and prosperity. They believe that
                        a nation should focus on its own citizens first, even if
                        it means limiting international agreements or foreign
                        involvement. This axis ultimately reflects the debate
                        between global engagement and national independence:
                        Should a country integrate with the world to tackle
                        global challenges, or should it focus on protecting its
                        identity, security, and interests above all else?
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                  Your responses are anonymous and will be used to determine
                  your political archetype.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Quiz header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold mb-2 md:mb-0">
                    {quizType === "short" ? "Short Quiz" : "Full Quiz"}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        quizType === "short"
                          ? "bg-secondary-darkBlue"
                          : "bg-primary-maroon"
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question with transition effect */}
                <div
                  className={`transition-opacity duration-300 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {/* Question */}
                  <h2 className="text-2xl font-bold mb-8">
                    {questions[currentQuestion]?.question}
                  </h2>

                  {/* Answer options - REVERSED ORDER */}
                  <div className="space-y-4">
                    {[2, 1, 0, -1, -2].map((value) => (
                      <button
                        key={value}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 
                          ${
                            answers[questions[currentQuestion]?._id] === value
                              ? value > 0
                                ? "bg-green-600 text-white border-green-600"
                                : value < 0
                                ? "bg-primary-maroon text-white border-primary-maroon"
                                : "bg-gray-500 text-white border-gray-500"
                              : "bg-white text-gray-700 border-gray-300 " +
                                (value > 0
                                  ? "hover:bg-green-50 hover:border-green-300"
                                  : value < 0
                                  ? "hover:bg-red-50 hover:border-primary-maroon"
                                  : "hover:bg-gray-100")
                          }`}
                        onClick={() => handleAnswer(value)}
                      >
                        {value === 2 && "Strongly Agree"}
                        {value === 1 && "Agree"}
                        {value === 0 && "Neutral"}
                        {value === -1 && "Disagree"}
                        {value === -2 && "Strongly Disagree"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                      currentQuestion === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : quizType === "short"
                        ? "bg-secondary-darkBlue text-white hover:bg-secondary-blue"
                        : "bg-primary-maroon text-white hover:bg-primary-darkMaroon"
                    }`}
                  >
                    <FaArrowLeft /> Previous
                  </button>

                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting ||
                        answers[questions[currentQuestion]?._id] === undefined
                      }
                      className={`px-6 py-2 rounded flex items-center gap-2 ${
                        isSubmitting ||
                        answers[questions[currentQuestion]?._id] === undefined
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : quizType === "short"
                          ? "bg-secondary-darkBlue text-white hover:bg-secondary-blue"
                          : "bg-primary-maroon text-white hover:bg-primary-darkMaroon"
                      }`}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={
                        answers[questions[currentQuestion]?._id] === undefined
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded ${
                        answers[questions[currentQuestion]?._id] === undefined
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : quizType === "short"
                          ? "bg-secondary-darkBlue text-white hover:bg-secondary-blue"
                          : "bg-primary-maroon text-white hover:bg-primary-darkMaroon"
                      }`}
                    >
                      Next <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
