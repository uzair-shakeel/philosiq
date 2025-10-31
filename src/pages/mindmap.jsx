import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import {
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaTimes,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import SmallLoader from "../components/SmallLoader";

// Filter options
const FILTER_OPTIONS = {
  education: [
    "High School",
    "Some College",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Other",
  ],
  gender: ["Male", "Female", "Transgender/Non-binary/Other"],
  ethnicity: [
    "White/Caucasian",
    "Hispanic/Latino",
    "Black/African American",
    "Asian",
    "Native American",
    "Other",
  ],
  age: ["0-18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  votingTendency: ["Left Leaning", "Right Leaning", "Other/Independent"],
};

// Map archetype names to their codes
const ARCHETYPE_MAP = [
  { code: "ELPSG", label: "The Utopian" },
  { code: "ELPSN", label: "The Reformer" },
  { code: "ELPRG", label: "The Prophet" },
  { code: "ELPRN", label: "The Firebrand" },
  { code: "ELCSG", label: "The Philosopher" },
  { code: "ELCSN", label: "The Localist" },
  { code: "ELCRG", label: "The Missionary" },
  { code: "ELCRN", label: "The Guardian" },
  { code: "EAPSG", label: "The Technocrat" },
  { code: "EAPSN", label: "The Enforcer" },
  { code: "EAPRG", label: "The Zealot" },
  { code: "EAPRN", label: "The Purist" },
  { code: "EACSG", label: "The Commander" },
  { code: "EACSN", label: "The Steward" },
  { code: "EACRG", label: "The Shepherd" },
  { code: "EACRN", label: "The High Priest" },
  { code: "FLPSG", label: "The Futurist" },
  { code: "FLPSN", label: "The Maverick" },
  { code: "FLPRG", label: "The Evangelist" },
  { code: "FLPRN", label: "The Dissenter" },
  { code: "FLCSG", label: "The Globalist" },
  { code: "FLCSN", label: "The Patriot" },
  { code: "FLCRG", label: "The Industrialist" },
  { code: "FLCRN", label: "The Traditionalist" },
  { code: "FAPSG", label: "The Overlord" },
  { code: "FAPSN", label: "The Corporatist" },
  { code: "FAPRG", label: "The Moralizer" },
  { code: "FAPRN", label: "The Builder" },
  { code: "FACSG", label: "The Executive" },
  { code: "FACSN", label: "The Ironhand" },
  { code: "FACRG", label: "The Regent" },
  { code: "FACRN", label: "The Crusader" },
];

export default function MindMap() {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState({});
  const [axisData, setAxisData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [contributionCount, setContributionCount] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [locationOptions, setLocationOptions] = useState({
    cities: [],
    states: [],
    countries: [],
  });
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch mindmap data from the API
  const fetchMindMapData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert filters to query parameters
      const queryParams = new URLSearchParams();

      // If no filters are set, use 'all' category
      if (Object.keys(filters).length === 0) {
        queryParams.append("category", "all");
      } else {
        // Add each active filter to query params
        Object.entries(filters).forEach(([category, value]) => {
          if (value) {
            queryParams.append(category, value);
          }
        });
      }

      const response = await fetch(`/api/mindmap?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setFilteredData(data.data.archetypePercentages || {});
        setAxisData(data.data.axisDistribution || {});
        setContributionCount(
          data.data.contributionCount || data.data.totalContributions || 0
        );
        setTotalContributions(data.data.totalContributions || 0);

        // Update available options if provided
        if (data.data.availableOptions) {
          setAvailableOptions((prev) => ({
            ...prev,
            ...data.data.availableOptions,
          }));
        }

        // Update location options if provided
        if (data.data.availableLocations) {
          setLocationOptions(data.data.availableLocations);
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

  // Fetch location options based on selected country and state
  const fetchLocationOptions = async (country = null, state = null) => {
    setIsLoadingLocations(true);
    try {
      const queryParams = new URLSearchParams();
      if (country) queryParams.append("country", country);
      if (state) queryParams.append("state", state);

      const response = await fetch(
        `/api/admin/mindmap/locations?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Only update the relevant parts of locationOptions
        setLocationOptions((prevOptions) => ({
          countries: data.locations.countries || prevOptions.countries,
          states: data.locations.states || [],
          cities: data.locations.cities || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching location options:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchMindMapData();
    fetchLocationOptions(); // Fetch all countries initially
  }, []);

  // Update data when filters change
  useEffect(() => {
    if (dataLoaded) {
      fetchMindMapData();
    }
  }, [filters]);

  // Handle country selection to update states
  useEffect(() => {
    if (filters.country) {
      fetchLocationOptions(filters.country);

      // Clear state and city when country changes
      if (filters.state) {
        setFilters((prev) => ({
          ...prev,
          state: "",
          city: "",
        }));
      }
    }
  }, [filters.country]);

  // Handle state selection to update cities
  useEffect(() => {
    if (filters.country && filters.state) {
      fetchLocationOptions(filters.country, filters.state);

      // Clear city when state changes
      if (filters.city) {
        setFilters((prev) => ({
          ...prev,
          city: "",
        }));
      }
    }
  }, [filters.state]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    // Refetch all location options
    fetchLocationOptions();
  };

  // Sort archetypes by percentage (descending)
  const sortedArchetypes = Object.entries(filteredData || {}).sort(
    ([, percentA], [, percentB]) => percentB - percentA
  );

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Function to get archetype code from name
  const getArchetypeCode = (archetypeName) => {
    const archetype = ARCHETYPE_MAP.find((a) => a.label === archetypeName);
    return archetype ? archetype.code.toLowerCase() : "";
  };

  const renderLocationFilters = () => (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-primary-maroon" />
        Location Filters
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={filters.country || ""}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
            disabled={isLoadingLocations}
          >
            <option value="">All Countries</option>
            {locationOptions.countries.sort().map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province
          </label>
          <select
            value={filters.state || ""}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
            disabled={!filters.country || isLoadingLocations}
          >
            <option value="">All States</option>
            {locationOptions.states.sort().map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {!filters.country && (
            <p className="text-xs text-gray-500 mt-1">Select a country first</p>
          )}
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
            disabled={!filters.state || isLoadingLocations}
          >
            <option value="">All Cities</option>
            {locationOptions.cities.sort().map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {!filters.state && (
            <p className="text-xs text-gray-500 mt-1">Select a state first</p>
          )}
        </div>
      </div>
      {isLoadingLocations && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
<SmallLoader />
          options...
        </div>
      )}
    </div>
  );

  return (
    <Layout title="MindMap - Philosiq">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">MindMap</h1>
            <p className="text-lg text-gray-600">
              Discover how different demographics align with political
              archetypes.
            </p>
            {totalContributions > 0 && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-full inline-block px-4">
                <span className="font-semibold">{totalContributions}</span>{" "}
                total contributions in database
                {activeFiltersCount > 0 &&
                  contributionCount !== totalContributions && (
                    <span className="ml-2">
                      (
                      <span className="font-semibold">{contributionCount}</span>{" "}
                      matching current filters)
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaFilter className="mr-2 text-primary-maroon" /> Filter Data
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Active Filters:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([category, value]) => {
                    if (!value) return null;
                    return (
                      <div
                        key={category}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <span className="capitalize">{category}</span>: {value}
                        <button
                          onClick={() => handleFilterChange(category, "")}
                          className="ml-2 hover:text-blue-900"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Options */}
            {showFilters && (
              <div>
                {/* Demographic Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(FILTER_OPTIONS).map(([field, options]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <select
                        value={filters[field] || ""}
                        onChange={(e) =>
                          handleFilterChange(field, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                      >
                        <option value="">All</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {renderLocationFilters()}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the component remains the same */}
          {loading ? (
            <div className="text-center py-12">
              <SmallLoader />
              <p className="text-gray-600">Loading MindMap data...</p>
            </div>
          ) : (
            <>
              {/* Axis Letter Distribution */}
              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <div className="flex items-center mb-6">
                  <h2 className="text-xl font-bold mr-2">Axis Distribution</h2>
                  <div className="relative group">
                    <button
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-white text-xs font-bold focus:outline-none"
                      title="What is this?"
                    >
                      ?
                    </button>
                    <div className="absolute top-6 left-0 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                      This section displays how quiz takers are distributed
                      across each ideological axis (e.g., Equity vs. Free
                      Market). It helps visualize the range of perspectives
                      within your audience.
                    </div>
                  </div>
                </div>
                {axisData && Object.keys(axisData).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(axisData).map(([axis, distribution]) => {
                      const letters = Object.entries(distribution);
                      const [leftLetter, leftPercentage] = letters[0] || [];
                      const [rightLetter, rightPercentage] = letters[1] || [];

                      // Determine colors based on axis
                      let leftSideColor = "bg-blue-600";
                      let rightSideColor = "bg-green-600";

                      switch (axis) {
                        case "Economic":
                          leftSideColor = "bg-blue-600"; // Blue for Equity
                          rightSideColor = "bg-green-600"; // Green for Free Market
                          break;
                        case "Authority":
                          leftSideColor = "bg-teal-500"; // Teal for Libertarian
                          rightSideColor = "bg-orange-500"; // Orange for Authoritarian
                          break;
                        case "Social":
                          leftSideColor = "bg-sky-500"; // Green for Progressive
                          rightSideColor = "bg-red-400"; // Blue for Conservative
                          break;
                        case "Religious":
                          leftSideColor = "bg-yellow-400"; // Yellow for Secular
                          rightSideColor = "bg-purple-500"; // Purple for Religious
                          break;
                        case "National":
                          leftSideColor = "bg-lime-500"; // Teal for Globalism
                          rightSideColor = "bg-rose-500"; // Green for Nationalism
                          break;
                      }

                      // Get the full axis name and labels
                      const getAxisInfo = (axis) => {
                        switch (axis) {
                          case "Economic":
                            return {
                              name: "Equity vs. Free Market",
                              leftLabel: "Equity",
                              rightLabel: "Free Market",
                            };
                          case "Authority":
                            return {
                              name: "Libertarian vs. Authoritarian",
                              leftLabel: "Libertarian",
                              rightLabel: "Authoritarian",
                            };
                          case "Social":
                            return {
                              name: "Progressive vs. Conservative",
                              leftLabel: "Progressive",
                              rightLabel: "Conservative",
                            };
                          case "Religious":
                            return {
                              name: "Secular vs. Religious",
                              leftLabel: "Secular",
                              rightLabel: "Religious",
                            };
                          case "National":
                            return {
                              name: "Globalism vs. Nationalism",
                              leftLabel: "Globalist",
                              rightLabel: "Nationalist",
                            };
                          default:
                            return {
                              name: axis,
                              leftLabel: leftLetter,
                              rightLabel: rightLetter,
                            };
                        }
                      };

                      const axisInfo = getAxisInfo(axis);

                      return (
                        <div key={axis} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{axisInfo.name}</span>
                          </div>
                          <div className="relative h-6 rounded-full overflow-hidden bg-gray-200">
                            <div
                              className={`h-full ${leftSideColor} absolute left-0 transition-all duration-300`}
                              style={{ width: `${leftPercentage}%` }}
                            ></div>
                            <div
                              className={`h-full ${rightSideColor} absolute right-0 transition-all duration-300`}
                              style={{ width: `${rightPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <div>
                              <span className="font-medium">
                                {axisInfo.leftLabel}
                              </span>
                              <span className="ml-2">{leftPercentage}%</span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {axisInfo.rightLabel}
                              </span>
                              <span className="ml-2">{rightPercentage}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No axis distribution data available for this filter yet.
                  </p>
                )}
              </div>

              {/* Archetype Distribution */}
              <div className="flex items-center mt-12">
                <h2 className="text-xl font-bold mr-2">
                  Archetype Distribution
                </h2>
                <div className="relative group">
                  <button
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-white text-xs font-bold focus:outline-none"
                    title="What is this?"
                  >
                    ?
                  </button>
                  <div className="absolute top-6 left-0 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    This section shows the percentage of quiz takers who fall
                    into each political archetype based on their quiz answers.
                  </div>
                </div>
              </div>

              {sortedArchetypes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No archetype data available for this filter yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {sortedArchetypes.map(([archetype, percentage]) => (
                    <div key={archetype} className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <Link
                          href={`/archetypes/${getArchetypeCode(archetype)}`}
                          className="text-sm font-medium text-primary-maroon hover:underline"
                        >
                          {archetype}
                        </Link>
                        <span className="text-sm text-gray-600">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <a
                        href={`/archetypes/${getArchetypeCode(archetype)}`}
                        className="block relative h-6 rounded-full overflow-hidden bg-gray-200 hover:shadow-md transition-all duration-300 group"
                        title={`View ${archetype} details`}
                      >
                        <div
                          className="h-full bg-primary-maroon absolute left-0 group-hover:bg-primary-darkMaroon transition-colors"
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-medium flex items-center">
                            View Details{" "}
                            <FaArrowRight className="ml-1" size={10} />
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Call to Action for Contributing Data */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Contribute to Our MindMap
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take the <strong>full quiz</strong> and help us build a more
              comprehensive view of how demographics and political beliefs
              intersect by anonymously contributing your data.
            </p>
            <Link
              href="/quiz"
              className="bg-primary-maroon text-white px-6 py-3 rounded-full hover:shadow-lg transition-all"
              shallow={false}
            >
              Take the Quiz & Contribute
            </Link>
          </div>

          {/* Debug Section */}
          {showDebug && (
            <div className="mt-12 bg-gray-100 p-4 rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(
                  {
                    filters,
                    contributionCount,
                    totalContributions,
                    filteredData,
                    locationOptions,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
