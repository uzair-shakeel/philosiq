import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { track } from "@vercel/analytics";
import { getCountriesList } from "../utils/countries";
import SmallLoader from "./SmallLoader";

// Comprehensive list of countries
const COUNTRIES = getCountriesList();

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
    ethnicity: "",
    country: "",
    zipCode: "",
    age: "",
    votingTendency: "",
    location: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [axisScores, setAxisScores] = useState({});

  const [validatingZipcode, setValidatingZipcode] = useState(false);
  const [zipcodeError, setZipcodeError] = useState("");
  const [locationData, setLocationData] = useState(null);

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

  // Function to validate zipcode
  const validateZipcode = async (zipcode) => {
    if (!zipcode) {
      setZipcodeError("Please enter a postal code");
      setLocationData(null);
      return false;
    }

    setValidatingZipcode(true);
    setZipcodeError("");

    try {
      // Use the enhanced zipcode-proxy API with optional country to disambiguate
      const countryParam = formData.country
        ? `&country=${encodeURIComponent(formData.country)}`
        : "";
      const response = await fetch(
        `/api/zipcode-proxy?zipcode=${encodeURIComponent(
          zipcode
        )}${countryParam}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not validate postal code");
      }

      if (data.isValid && data.location) {
        setZipcodeError("");

        // Check if the location has "Unknown" values
        const hasUnknownValues =
          (data.location.city === "Unknown" &&
            data.location.state === "Unknown") ||
          (!data.location.city && !data.location.state);

        // If using fallback with unknown values, show a warning but still accept
        if (data.source === "fallback" && hasUnknownValues) {
          setZipcodeError(
            `We recognized this as a ${data.location.country} postal code, but couldn't find specific location details. You can proceed or enter manually.`
          );
        }

        // Add a flag if this is using fallback data
        const locationWithSource = {
          ...data.location,
          source: data.source || "api",
        };

        setLocationData(locationWithSource);
        setFormData((prev) => ({
          ...prev,
          location: locationWithSource,
        }));
        return true;
      } else {
        // If the API says it's invalid but we have a location, use it anyway
        if (data.location) {
          const locationWithSource = {
            ...data.location,
            source: "fallback",
          };

          setLocationData(locationWithSource);
          setFormData((prev) => ({
            ...prev,
            location: locationWithSource,
          }));

          setZipcodeError(
            "This postal code format was recognized, but we couldn't verify the exact location. You can proceed or enter manually."
          );
          return true;
        }

        throw new Error(data.error || "Invalid postal code format");
      }
    } catch (error) {
      console.error("Error validating postal code:", error);
      setZipcodeError(
        error.message ||
          "Failed to validate postal code. You can enter location manually."
      );
      setLocationData(null);
      return false;
    } finally {
      setValidatingZipcode(false);
    }
  };

  // Update the handleManualOverride function to better support international postal codes
  const handleManualOverride = () => {
    if (!formData.zipCode) return;

    // Try to detect the country from the zipcode format
    const zipcode = formData.zipCode.trim();
    // Prefer user-selected country if provided
    let countryCode = formData.country || "US";
    let countryName =
      COUNTRIES.find((c) => c.code === countryCode)?.name || "United States";
    let cityName = "Manual City";
    let stateName = "Manual Region";

    // Simple detection based on format
    if (
      !formData.country &&
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zipcode)
    ) {
      // Canadian postal code
      countryCode = "CA";
      countryName = "Canada";

      // Try to determine province from first letter
      const firstLetter = zipcode.substring(0, 1).toUpperCase();
      switch (firstLetter) {
        case "A":
          stateName = "Newfoundland and Labrador";
          break;
        case "B":
          stateName = "Nova Scotia";
          break;
        case "C":
          stateName = "Prince Edward Island";
          break;
        case "E":
          stateName = "New Brunswick";
          break;
        case "G":
        case "H":
        case "J":
          stateName = "Quebec";
          break;
        case "K":
        case "L":
        case "M":
        case "N":
        case "P":
          stateName = "Ontario";
          break;
        case "R":
          stateName = "Manitoba";
          break;
        case "S":
          stateName = "Saskatchewan";
          break;
        case "T":
          stateName = "Alberta";
          break;
        case "V":
          stateName = "British Columbia";
          break;
        case "X":
          stateName = "Northern Territories";
          break;
        case "Y":
          stateName = "Yukon";
          break;
      }
      cityName = `${stateName} Region`;
    } else if (
      !formData.country &&
      /^[A-Za-z]{1,2}\d[A-Za-z\d]?[ ]?\d[A-Za-z]{2}$/.test(zipcode)
    ) {
      // UK postal code
      countryCode = "GB";
      countryName = "United Kingdom";
      stateName = "United Kingdom";
      cityName = "UK Location";
    } else if (/^\d{5}$/.test(zipcode)) {
      // Could be US, Pakistan, or others - check first digit
      if (formData.country === "PK") {
        countryCode = "PK";
        countryName = "Pakistan";
        stateName = "Pakistan";
        cityName = "Pakistan Region";
      } else {
        // Default to US logic
        countryCode = "US";
        countryName = "United States";

        const prefix = zipcode.substring(0, 3);
        const prefixNum = parseInt(prefix, 10);

        // Map ZIP code prefixes to general regions
        if (prefixNum >= 0 && prefixNum <= 99) {
          stateName = "US Territories";
          cityName = "US Territory";
        } else if (prefixNum >= 100 && prefixNum <= 199) {
          stateName = "Northeast US";
          cityName = "Northeast Region";
        } else if (prefixNum >= 200 && prefixNum <= 299) {
          stateName = "Mid-Atlantic US";
          cityName = "Mid-Atlantic Region";
        } else if (prefixNum >= 300 && prefixNum <= 399) {
          stateName = "Southeast US";
          cityName = "Southeast Region";
        } else if (prefixNum >= 400 && prefixNum <= 499) {
          stateName = "Midwest US";
          cityName = "Midwest Region";
        } else if (prefixNum >= 500 && prefixNum <= 599) {
          stateName = "Central US";
          cityName = "Central Region";
        } else if (prefixNum >= 600 && prefixNum <= 699) {
          stateName = "Central US";
          cityName = "Central Region";
        } else if (prefixNum >= 700 && prefixNum <= 799) {
          stateName = "South Central US";
          cityName = "South Central Region";
        } else if (prefixNum >= 800 && prefixNum <= 899) {
          stateName = "Western US";
          cityName = "Western Region";
        } else if (prefixNum >= 900 && prefixNum <= 999) {
          stateName = "West Coast US";
          cityName = "West Coast Region";
        }
      }
    } else if (/^\d{6}$/.test(zipcode)) {
      // Indian postal code
      if (!formData.country || formData.country === "IN") {
        countryCode = "IN";
        countryName = "India";
        stateName = "India";
        cityName = "India Location";
      }
    } else if (/^\d{4}$/.test(zipcode)) {
      // Australian postal code
      if (!formData.country || formData.country === "AU") {
        countryCode = "AU";
        countryName = "Australia";
        stateName = "Australia";
        cityName = "Australia Location";
      }
    }

    // Create a manual location object
    const manualLocation = {
      zipcode: zipcode,
      city: cityName,
      state: stateName,
      state_code: countryCode,
      country: countryName,
      country_code: countryCode,
      isManualEntry: true,
    };

    setLocationData(manualLocation);
    setFormData((prev) => ({
      ...prev,
      location: manualLocation,
    }));
    setZipcodeError("");
  };

  // Modify handleChange to include zipcode validation
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "zipCode") {
      // Update the form data with the zipcode
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear any previous location data when zipcode changes
      if (!value || value.length < 3) {
        setLocationData(null);
        setZipcodeError("");
      } else if (value.length >= 5) {
        // Validate complete zipcodes with a small delay
        setTimeout(() => {
          validateZipcode(value);
        }, 300);
      }
    } else if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
      }));
      // Clear current location when country changes
      setLocationData(null);
      setZipcodeError("");
      // Re-validate if zipcode is present
      const currentZip = formData.zipCode?.trim();
      if (currentZip && currentZip.length >= 3) {
        setTimeout(() => {
          validateZipcode(currentZip);
        }, 150);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const nextStep = () => {
    setStep(Math.min(step + 1, totalSteps));
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const canProceedToStep2 =
    formData.education && formData.gender && formData.ethnicity;
  const canProceedToStep3 =
    formData.age && formData.country && formData.location && !zipcodeError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Track contribution start
      track("mindmap_contribution_started", { archetype });

      const response = await fetch("/api/mindmap/contribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          race: formData.ethnicity,
          archetype,
          axisScores,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit data");
      }

      // Track successful contribution
      track("mindmap_contribution_completed", {
        archetype,
        demographics: {
          age: formData.age,
          gender: formData.gender,
          education: formData.education,
          votingTendency: formData.votingTendency,
          country: formData.location?.country || "Unknown",
        },
      });

      setSuccess(true);
      localStorage.setItem("hasContributedToMindMap", "true");

      setTimeout(() => {
        window.location.href = "/mindmap";
      }, 2000);
    } catch (error) {
      console.error("Error submitting demographic data:", error);

      // Track contribution error
      track("mindmap_contribution_error", {
        error: error.message || "Unknown error",
        archetype,
      });

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

              {/* Ethnicity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ethnicity
                </label>
                <select
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select ethnicity</option>
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
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  required
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal/Zip Code (International formats supported)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent ${
                      zipcodeError
                        ? "border-red-500"
                        : locationData
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your postal/zip code"
                    maxLength={10}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {validatingZipcode ? (
                      <SmallLoader />
                    ) : locationData ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : zipcodeError ? (
                      <FaTimesCircle className="text-red-500" />
                    ) : null}
                  </div>
                </div>
                {zipcodeError && (
                  <div className="mt-1">
                    <p className="text-sm text-red-600 mb-2">{zipcodeError}</p>
                    <button
                      type="button"
                      onClick={handleManualOverride}
                      className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center"
                    >
                      <FaInfoCircle className="mr-1" />
                      Enter manually
                    </button>
                  </div>
                )}
                {locationData && (
                  <div
                    className={`mt-2 p-3 ${
                      locationData.isManualEntry
                        ? "bg-yellow-50 border-yellow-200"
                        : locationData.source === "fallback" ||
                          locationData.isFallback
                        ? "bg-blue-50 border-blue-200"
                        : "bg-green-50 border-green-200"
                    } border rounded-md`}
                  >
                    <div className="flex items-center mb-1">
                      <FaCheckCircle
                        className={`${
                          locationData.isManualEntry
                            ? "text-yellow-500"
                            : locationData.source === "fallback" ||
                              locationData.isFallback
                            ? "text-blue-500"
                            : "text-green-500"
                        } mr-2`}
                      />
                      <span
                        className={`font-medium ${
                          locationData.isManualEntry
                            ? "text-yellow-700"
                            : locationData.source === "fallback" ||
                              locationData.isFallback
                            ? "text-blue-700"
                            : "text-green-700"
                        }`}
                      >
                        {locationData.isManualEntry
                          ? "Manual Entry"
                          : locationData.source === "fallback" ||
                            locationData.isFallback
                          ? "Location Identified"
                          : "Location Verified"}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        locationData.isManualEntry
                          ? "text-yellow-700"
                          : locationData.source === "fallback" ||
                            locationData.isFallback
                          ? "text-blue-700"
                          : "text-green-700"
                      }`}
                    >
                      {locationData.city && locationData.city !== "Unknown"
                        ? locationData.city
                        : locationData.country === "Pakistan"
                        ? "Pakistan Region"
                        : locationData.country === "India"
                        ? "India Region"
                        : "Region"}
                      ,{" "}
                      {locationData.state && locationData.state !== "Unknown"
                        ? locationData.state
                        : locationData.country}{" "}
                      {locationData.zipcode} ({locationData.country})
                    </p>
                    {(locationData.source === "fallback" ||
                      locationData.isFallback) && (
                      <p className="text-xs text-blue-600 mt-1">
                        {locationData.city === "Unknown" ||
                        locationData.state === "Unknown"
                          ? "We couldn't find exact details for this postal code, but we've identified the country. You can proceed or enter manually if needed."
                          : "Using approximate location data based on your postal code format. You can proceed or enter manually if needed."}
                      </p>
                    )}
                    {locationData.isManualEntry && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Using manually entered location. Your regional data will
                        still be helpful for our research.
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Your specific location will not be stored, only aggregated
                    regional data.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: US (12345), Canada (A1A 1A1), UK (SW1A 1AA),
                    Pakistan (44000), India (110001), Australia (2000)
                  </p>
                </div>
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
                  <option value="0-18">0-18</option>
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
