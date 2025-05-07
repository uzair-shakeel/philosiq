import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import {
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";

// Filter options
const FILTER_OPTIONS = {
  education: [
    "High School",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Other",
  ],
  gender: ["Male", "Female", "Non-binary/Other"],
  race: [
    "White/Caucasian",
    "Black/African American",
    "Hispanic/Latino",
    "Asian",
    "Other",
  ],
  zipCode: ["Urban", "Suburban", "Rural"], // Simplified for location analysis
  age: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  votingTendency: ["Left Leaning", "Right Leaning", "Other/Independent"],
};

export default function MindMap() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [filteredData, setFilteredData] = useState({});
  const [axisData, setAxisData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [contributionCount, setContributionCount] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  // Fetch mindmap data from the API
  const fetchMindMapData = async (category, value) => {
    setLoading(true);
    setError(null);

    try {
      // If no category is selected, just fetch overall statistics
      const queryParams = category
        ? `category=${category}${value ? `&value=${value}` : ""}`
        : `category=all`; // Use "all" as a special case for the API

      const response = await fetch(`/api/mindmap?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // When using the "all" category or if this is a filter-specific call with a value
        if (category === "all" || !category) {
          // Update with global data
          setFilteredData(data.data.archetypePercentages || {});
          setAxisData(data.data.axisDistribution || {});
          // Use total contributions as the count for the unfiltered view
          setContributionCount(data.data.totalContributions || 0);
        } else if (value) {
          // Update with filtered data
          setFilteredData(data.data.archetypePercentages || {});
          setAxisData(data.data.axisDistribution || {});

          // Update contribution count for this filter
          if (data.data.contributionCount) {
            setContributionCount(data.data.contributionCount);
          }
        }

        // Always update total contributions
        if (data.data.totalContributions) {
          setTotalContributions(data.data.totalContributions);
        }

        // Update available options if provided by the API
        if (
          data.data.availableOptions &&
          data.data.availableOptions.length > 0
        ) {
          setAvailableOptions((prev) => ({
            ...prev,
            [category]: data.data.availableOptions,
          }));

          // If the current activeOption isn't in the available options,
          // update it to the first available option
          if (
            data.data.availableOptions.length > 0 &&
            !data.data.availableOptions.includes(activeOption)
          ) {
            setActiveOption(data.data.availableOptions[0]);
          }
        }

        setDataLoaded(true);
      } else {
        throw new Error(data.message || "Failed to fetch MindMap data");
      }
    } catch (error) {
      console.error("Error fetching MindMap data:", error);
      setError(
        error.message || "Failed to load MindMap data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    // Fetch data with the "all" category for initial view
    fetchMindMapData("all", null);

    // Fetch available options for each filter category
    const fetchAllOptions = async () => {
      const options = {};

      // Fetch options for each category
      for (const category of Object.keys(FILTER_OPTIONS)) {
        try {
          const response = await fetch(`/api/mindmap?category=${category}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.availableOptions) {
              options[category] = data.data.availableOptions;
            } else {
              // Fall back to predefined options if API doesn't return any
              options[category] = FILTER_OPTIONS[category];
            }
          }
        } catch (error) {
          console.error(`Error fetching options for ${category}:`, error);
          // Fall back to predefined options
          options[category] = FILTER_OPTIONS[category];
        }
      }

      setAvailableOptions(options);
    };

    fetchAllOptions();
  }, []);

  // Update data when filter changes
  useEffect(() => {
    if (dataLoaded) {
      fetchMindMapData(activeFilter, activeOption);
    }
  }, [activeFilter, activeOption]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);

    // Use the first option from available options or fall back to predefined options
    const options = availableOptions[filter] || FILTER_OPTIONS[filter];
    setActiveOption(options[0]);

    // Trigger data load with the new filter
    if (dataLoaded) {
      fetchMindMapData(filter, options[0]);
    }
  };

  const handleOptionChange = (option) => {
    setActiveOption(option);
  };

  // Sort archetypes by percentage (descending)
  const sortedArchetypes = Object.entries(filteredData || {}).sort(
    ([, percentA], [, percentB]) => percentB - percentA
  );

  return (
    <Layout title="MindMap - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">MindMap</h1>
            <p className="text-lg text-gray-600">
              Discover how different demographics align with political
              archetypes
            </p>
            {totalContributions > 0 && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-full inline-block px-4">
                <span className="font-semibold">{totalContributions}</span>{" "}
                total contributions in database
                {activeFilter && contributionCount !== totalContributions && (
                  <span className="ml-2">
                    (<span className="font-semibold">{contributionCount}</span>{" "}
                    matching {activeFilter} filter)
                  </span>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
              <p className="mt-2">
                Try refreshing the page or check back later as we gather more
                data.
              </p>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaFilter className="mr-2 text-primary-maroon" /> Filter By
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => {
                  setActiveFilter(null);
                  setActiveOption(null);
                  // Explicitly fetch with the "all" category
                  if (dataLoaded) {
                    fetchMindMapData("all", null);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === null
                    ? "bg-primary-maroon text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                All Data
              </button>
              {Object.keys(FILTER_OPTIONS).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === filter
                      ? "bg-primary-maroon text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {activeFilter && (
              <div className="flex flex-wrap gap-2">
                {(
                  availableOptions[activeFilter] || FILTER_OPTIONS[activeFilter]
                ).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionChange(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeOption === option
                        ? "bg-secondary-darkBlue text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-maroon mx-auto mb-4" />
              <p className="text-gray-600">Loading MindMap data...</p>
            </div>
          ) : (
            <>
              {/* Archetype Distribution */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">
                  Archetype Distribution
                </h2>

                {sortedArchetypes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No archetype data available for this filter yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {sortedArchetypes.map(([archetype, percentage]) => (
                      <div key={archetype} className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {archetype}
                          </span>
                          <span className="text-sm text-gray-600">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative h-6 rounded-full overflow-hidden bg-gray-200">
                          <div
                            className="h-full bg-primary-maroon absolute left-0"
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Call to Action for Contributing Data */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Contribute to Our MindMap
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Help us build a more comprehensive view of how demographics and
              political beliefs intersect by anonymously contributing your data.
            </p>
            <Link
              href="/quiz"
              className="bg-primary-maroon text-white px-6 py-3 rounded-full hover:shadow-lg transition-all"
            >
              Take the Quiz & Contribute
            </Link>
          </div>

          {/* Debug Section (hidden by default) */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm text-gray-500 underline"
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>

            {showDebug && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg text-left max-w-2xl mx-auto">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <p>
                  <strong>Total Contributions:</strong> {totalContributions}
                </p>
                <p>
                  <strong>Filtered Contributions:</strong>{" "}
                  {activeFilter ? contributionCount : totalContributions}
                </p>
                <p>
                  <strong>Current Filter:</strong>{" "}
                  {activeFilter
                    ? `${activeFilter} = ${activeOption || "All"}`
                    : "No filter (showing all data)"}
                </p>
                <p>
                  <strong>Available Options:</strong>{" "}
                  {JSON.stringify(availableOptions[activeFilter] || [])}
                </p>
                <hr className="my-2" />
                <p>
                  <strong>Archetype Data:</strong>
                </p>
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(filteredData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
