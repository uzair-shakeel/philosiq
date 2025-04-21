import React, { useState } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../../components/AdminLayout";
import { useRouter } from "next/router";
import axios from "axios";
import { FaSave, FaTimes, FaExclamationTriangle } from "react-icons/fa";

export default function NewQuestion() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    question: "",
    axis: "Equity vs. Free Market",
    topic: "",
    direction: "Left",
    weight: 1,
    weight_agree: 1,
    weight_disagree: 1,
    active: true,
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));

      // Clear validation error for this field
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};

    if (!formData.question.trim()) {
      errors.question = "Question is required";
    }

    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Submit form
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/questions", formData);

      if (response.data.success) {
        // Redirect to questions list
        router.push("/admin/questions");
      } else {
        throw new Error(response.data.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create question. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    router.push("/admin/questions");
  };

  return (
    <AdminLayout title="Add New Question">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Add New Question</h1>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div className="mb-6">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows="3"
              className={`w-full rounded-md border ${
                validationErrors.question ? "border-red-500" : "border-gray-300"
              } p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon`}
              placeholder="Enter the question text"
            />
            {validationErrors.question && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationTriangle className="mr-1" />{" "}
                {validationErrors.question}
              </p>
            )}
          </div>

          {/* Axis and Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="axis"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Axis <span className="text-red-500">*</span>
              </label>
              <select
                id="axis"
                name="axis"
                value={formData.axis}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              >
                <option value="">Select an axis</option>
                <option value="Equity vs. Free Market">
                  Equity vs. Free Market
                </option>
                <option value="Libertarian vs. Authoritarian">
                  Libertarian vs. Authoritarian
                </option>
                <option value="Progressive vs. Conservative">
                  Progressive vs. Conservative
                </option>
                <option value="Secular vs. Religious">
                  Secular vs. Religious
                </option>
                <option value="Globalism vs. Nationalism">
                  Globalism vs. Nationalism
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  validationErrors.topic ? "border-red-500" : "border-gray-300"
                } p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon`}
                placeholder="Enter a topic (e.g., Economy, Healthcare)"
              />
              {validationErrors.topic && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FaExclamationTriangle className="mr-1" />{" "}
                  {validationErrors.topic}
                </p>
              )}
            </div>
          </div>

          {/* Direction and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="direction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Direction <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="Left"
                    checked={formData.direction === "Left"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-maroon focus:ring-primary-maroon border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Left</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="Right"
                    checked={formData.direction === "Right"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-maroon focus:ring-primary-maroon border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Right</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Left represents the first part of the axis (e.g., Equality),
                Right represents the second part (e.g., Markets)
              </p>
            </div>

            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Weight (Legacy){" "}
                <span className="text-gray-400 text-xs">(1-5)</span>
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="1"
                max="5"
                value={formData.weight}
                onChange={handleNumberChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values have stronger impact on results
              </p>
            </div>
          </div>

          {/* Weight Agree and Disagree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="weight_agree"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Weight for Agree <span className="text-red-500">*</span>{" "}
                <span className="text-gray-400 text-xs">(1-5)</span>
              </label>
              <input
                type="number"
                id="weight_agree"
                name="weight_agree"
                min="1"
                max="5"
                value={formData.weight_agree}
                onChange={handleNumberChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              />
              <p className="text-xs text-gray-500 mt-1">
                Weight when user agrees with the question
              </p>
            </div>

            <div>
              <label
                htmlFor="weight_disagree"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Weight for Disagree <span className="text-red-500">*</span>{" "}
                <span className="text-gray-400 text-xs">(1-5)</span>
              </label>
              <input
                type="number"
                id="weight_disagree"
                name="weight_disagree"
                min="1"
                max="5"
                value={formData.weight_disagree}
                onChange={handleNumberChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon"
              />
              <p className="text-xs text-gray-500 mt-1">
                Weight when user disagrees with the question
              </p>
            </div>
          </div>

          {/* Active Status */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-maroon focus:ring-primary-maroon border-gray-300 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active (include this question in quizzes)
              </label>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-primary-maroon hover:bg-primary-darkMaroon text-white rounded-md flex items-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FaSave className="mr-2" />
              {isSubmitting ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (!session || session.user.role !== "admin") {
  //   return {
  //     redirect: {
  //       destination: "/auth/signin?callbackUrl=/admin/questions/new",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}
