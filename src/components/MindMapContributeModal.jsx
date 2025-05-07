import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaInfoCircle,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function MindMapContributeModal({
  isOpen,
  onClose,
  archetype,
  axisScores: providedAxisScores,
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    education: "",
    gender: "",
    race: "",
    zipCode: "",
    age: "",
    votingTendency: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [axisScores, setAxisScores] = useState({});

  // Load axis scores from props or stored results when component mounts
  useEffect(() => {
    // If axis scores are provided via props, use those first
    if (providedAxisScores && Object.keys(providedAxisScores).length > 0) {
      // Format axis scores for storage
      const formattedScores = {};
      Object.entries(providedAxisScores).forEach(([key, value]) => {
        // Replace spaces with underscores for MongoDB compatibility
        formattedScores[key.replace(/ /g, "_")] = value;
      });
      setAxisScores(formattedScores);
      return;
    }

    // Otherwise try to get them from storage
    try {
      // Try sessionStorage first, then localStorage
      let storedData = sessionStorage.getItem("quizResults");
      if (!storedData) {
        storedData = localStorage.getItem("quizResults");
      }

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.axisScores) {
          // Format axis scores for storage
          const formattedScores = {};
          Object.entries(parsedData.axisScores).forEach(([key, value]) => {
            // Replace spaces with underscores for MongoDB compatibility
            formattedScores[key.replace(/ /g, "_")] = value;
          });
          setAxisScores(formattedScores);
        }
      }
    } catch (err) {
      console.error("Error loading axis scores:", err);
    }
  }, [providedAxisScores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setStep(Math.min(step + 1, totalSteps));
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const canProceedToStep2 =
    formData.education && formData.gender && formData.race;
  const canProceedToStep3 =
    formData.age && formData.zipCode && formData.votingTendency;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Real API call to save the contribution
      const response = await fetch("/api/mindmap/contribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          archetype,
          axisScores,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit data");
      }

      setSuccess(true);

      // After successful submission, store a flag in localStorage
      localStorage.setItem("hasContributedToMindMap", "true");

      // Redirect to mind map page
      setTimeout(() => {
        router.push("/mindmap");
      }, 2000);
    } catch (error) {
      console.error("Error submitting demographic data:", error);
      setError(
        error.message || "Failed to submit your data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaCheck className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-maroon to-secondary-darkBlue bg-clip-text text-transparent">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Your anonymous contribution helps build a more comprehensive
              picture of political beliefs across different demographics.
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-2 items-center">
                <div className="h-2 w-2 bg-primary-maroon rounded-full"></div>
                <div className="h-2 w-2 bg-primary-maroon rounded-full"></div>
                <div className="h-2 w-2 bg-primary-maroon rounded-full"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Redirecting you to the MindMap...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaMapMarkedAlt className="text-2xl text-primary-maroon mr-3" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-maroon to-secondary-darkBlue bg-clip-text text-transparent">
              Contribute to MindMap
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center 
                  ${
                    step === stepNum
                      ? "bg-primary-maroon text-white"
                      : step > stepNum
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step > stepNum ? <FaCheck /> : stepNum}
              </div>
              <div className="text-xs mt-1 font-medium">
                {stepNum === 1
                  ? "Identity"
                  : stepNum === 2
                  ? "Location & Age"
                  : "Political Leaning"}
              </div>
            </div>
          ))}
          <div className="absolute left-0 right-0 flex justify-center -z-10">
            <div className="h-0.5 bg-gray-200 w-2/3 absolute top-5"></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md text-red-700">
            <div className="flex">
              <FaInfoCircle className="text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <p className="text-blue-700 flex items-start">
            <FaInfoCircle className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>
              Your anonymous data helps build a comprehensive map of political
              beliefs across different demographics. No personally identifiable
              information will be stored.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Identity */}
          <div
            className={`transition-opacity duration-300 ${
              step === 1
                ? "opacity-100"
                : "opacity-0 h-0 overflow-hidden absolute"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Identity Information
            </h3>
            <div className="space-y-5">
              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest Education
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary/Other">Non-binary/Other</option>
                </select>
              </div>

              {/* Race/Ethnicity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Race/Ethnicity
                </label>
                <select
                  name="race"
                  value={formData.race}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select race/ethnicity</option>
                  <option value="White/Caucasian">White/Caucasian</option>
                  <option value="Black/African American">
                    Black/African American
                  </option>
                  <option value="Hispanic/Latino">Hispanic/Latino</option>
                  <option value="Asian">Asian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Location & Age */}
          <div
            className={`transition-opacity duration-300 ${
              step === 2
                ? "opacity-100"
                : "opacity-0 h-0 overflow-hidden absolute"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Location & Age
            </h3>
            <div className="space-y-5">
              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  placeholder="Enter your zip code"
                  pattern="[0-9]{5}"
                  title="Five digit zip code"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your specific location will not be stored, only aggregated
                  regional data.
                </p>
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select age group</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Political Leaning */}
          <div
            className={`transition-opacity duration-300 ${
              step === 3
                ? "opacity-100"
                : "opacity-0 h-0 overflow-hidden absolute"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Political Information
            </h3>
            <div className="space-y-5">
              {/* Voting Tendency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voting Tendency
                </label>
                <select
                  name="votingTendency"
                  value={formData.votingTendency}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select voting tendency</option>
                  <option value="Left Leaning">Left Leaning</option>
                  <option value="Right Leaning">Right Leaning</option>
                  <option value="Other/Independent">Other/Independent</option>
                </select>
              </div>

              <div className="p-4 border rounded-lg mt-6 bg-gray-50">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Your Archetype
                </h4>
                <div className="bg-gradient-to-r from-primary-maroon to-secondary-darkBlue text-white py-3 px-4 rounded-lg">
                  {archetype || "Unknown"}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  This archetype will be anonymously contributed to our MindMap
                  data to help understand political belief patterns across
                  different demographics.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaChevronLeft className="mr-1" /> Back
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                className={`flex items-center px-5 py-2 rounded-lg text-white transition-colors ${
                  (step === 1 && canProceedToStep2) ||
                  (step === 2 && canProceedToStep3)
                    ? "bg-primary-maroon hover:bg-primary-darkMaroon"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Next <FaChevronRight className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Contribute Anonymously"
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your data is anonymous and will only be used for aggregated
            statistics. No personally identifiable information will be stored.
          </p>
        </form>
      </div>
    </div>
  );
}
