import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  FaArrowRight,
  FaArrowLeft,
  FaClipboardList,
  FaClipboardCheck,
} from "react-icons/fa";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showingAxes, setShowingAxes] = useState(false);

  // Sample questions - in a real app, these would come from an API
  const allQuestions = [
    {
      id: 1,
      text: "The government should prioritize economic growth over environmental protection.",
      category: "Economic",
    },
    {
      id: 2,
      text: "Healthcare should be provided as a public service to all citizens.",
      category: "Economic",
    },
    {
      id: 3,
      text: "International cooperation is more effective than national self-interest.",
      category: "Diplomatic",
    },
    {
      id: 4,
      text: "Individual freedom is more important than social equality.",
      category: "Civil",
    },
    {
      id: 5,
      text: "Traditional values should guide social policy.",
      category: "Societal",
    },
    {
      id: 6,
      text: "Military strength is essential for national security.",
      category: "Military",
    },
    {
      id: 7,
      text: "Religious principles should influence government decisions.",
      category: "Religious",
    },
    {
      id: 8,
      text: "Free markets lead to more prosperity than government intervention.",
      category: "Economic",
    },
    {
      id: 9,
      text: "A strong leader is more effective than democratic consensus.",
      category: "Civil",
    },
    {
      id: 10,
      text: "National borders should be strictly controlled.",
      category: "Diplomatic",
    },
    // Additional questions to have more variety
    {
      id: 11,
      text: "Society should strive for greater income equality.",
      category: "Economic",
    },
    {
      id: 12,
      text: "Corporations have too much power in today's society.",
      category: "Economic",
    },
    {
      id: 13,
      text: "Immigration enriches our culture and economy.",
      category: "Diplomatic",
    },
    {
      id: 14,
      text: "The government should regulate speech that is offensive to minorities.",
      category: "Civil",
    },
    {
      id: 15,
      text: "Marriage is primarily a religious institution.",
      category: "Societal",
    },
    {
      id: 16,
      text: "Military intervention in other countries is sometimes necessary for global stability.",
      category: "Military",
    },
    {
      id: 17,
      text: "Public education should include religious perspectives.",
      category: "Religious",
    },
    {
      id: 18,
      text: "Taxation of the wealthy should be increased to fund social programs.",
      category: "Economic",
    },
    {
      id: 19,
      text: "Direct democracy is preferable to representative democracy.",
      category: "Civil",
    },
    {
      id: 20,
      text: "Global institutions should have more authority over national governments.",
      category: "Diplomatic",
    },
  ];

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Function to generate a large set of questions by modifying existing ones
  const generateLargeQuestionSet = (baseQuestions, targetCount) => {
    const result = [...baseQuestions];

    // If we already have enough questions, just return them shuffled
    if (baseQuestions.length >= targetCount) {
      return shuffleArray(baseQuestions).slice(0, targetCount);
    }

    // Generate variations of existing questions to reach the target count
    let currentId = Math.max(...baseQuestions.map((q) => q.id)) + 1;

    while (result.length < targetCount) {
      const originalQuestion =
        baseQuestions[result.length % baseQuestions.length];

      // Create variations by adding qualifiers or slightly changing the wording
      const variations = [
        `In most cases, ${originalQuestion.text.toLowerCase()}`,
        `Generally speaking, ${originalQuestion.text.toLowerCase()}`,
        `From a practical standpoint, ${originalQuestion.text.toLowerCase()}`,
        `Considering long-term outcomes, ${originalQuestion.text.toLowerCase()}`,
        `In the current global context, ${originalQuestion.text.toLowerCase()}`,
        `From an ethical perspective, ${originalQuestion.text.toLowerCase()}`,
      ];

      // Add a variation if we haven't reached the target count
      if (result.length < targetCount) {
        const variationIndex = result.length % variations.length;
        result.push({
          id: currentId++,
          text: variations[variationIndex],
          category: originalQuestion.category,
        });
      }
    }

    return shuffleArray(result).slice(0, targetCount);
  };

  const startQuiz = (type) => {
    setQuizType(type);

    if (type === "short") {
      // Generate 36 questions for the short quiz
      setQuestions(generateLargeQuestionSet(allQuestions, 36));
    } else {
      // Generate 130 questions for the full quiz
      setQuestions(generateLargeQuestionSet(allQuestions, 130));
    }

    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion]?.id]: value,
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

  const handleSubmit = () => {
    // In a real app, you would send the answers to your backend
    console.log("Answers submitted:", answers);
    // Redirect to results page or show results
    alert(
      "Thank you for completing the quiz! Your results would be shown here."
    );
  };

  const toggleAxesDisplay = () => {
    setShowingAxes(!showingAxes);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout title="Political Survey Quiz - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {!quizStarted ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                  Political Survey Quiz
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Discover your political identity by answering questions about
                  your views on various political issues.
                </p>
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
                      36 questions • ~10 minutes
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      A condensed version of our political survey that covers
                      the essential aspects of political ideology. Perfect if
                      you're short on time.
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
                      130 questions • ~30 minutes
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      Our comprehensive political survey that explores the full
                      spectrum of political thought. Provides the most accurate
                      and detailed results.
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
                    {questions[currentQuestion]?.text}
                  </h2>

                  {/* Answer options - REVERSED ORDER */}
                  <div className="space-y-4">
                    {[2, 1, 0, -1, -2].map((value) => (
                      <button
                        key={value}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 
                          ${
                            answers[questions[currentQuestion]?.id] === value
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
                        answers[questions[currentQuestion]?.id] === undefined
                      }
                      className={`px-6 py-2 rounded flex items-center gap-2 ${
                        answers[questions[currentQuestion]?.id] === undefined
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
                        answers[questions[currentQuestion]?.id] === undefined
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded ${
                        answers[questions[currentQuestion]?.id] === undefined
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
