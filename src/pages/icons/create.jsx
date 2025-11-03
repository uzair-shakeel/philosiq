import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import {
  FaSearch,
  FaUser,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import SmallLoader from "../../components/SmallLoader";

// Helper function to extract source media from character description
function extractSourceMedia(extract) {
  if (!extract) return "";

  const sourcePatterns = [
    /from\s+(?:the\s+)?(?:film|movie|television|tv|series|show|anime|manga|comic|book|novel|game|video game)\s+(?:called\s+)?["']?([^"'.]+)["']?/i,
    /in\s+(?:the\s+)?(?:film|movie|television|tv|series|show|anime|manga|comic|book|novel|game|video game)\s+(?:called\s+)?["']?([^"'.]+)["']?/i,
    /(?:film|movie|television|tv|series|show|anime|manga|comic|book|novel|game|video game)\s+(?:called\s+)?["']?([^"'.]+)["']?/i,
  ];

  for (const pattern of sourcePatterns) {
    const match = extract.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
}

export default function CreateIconPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication using localStorage (your custom auth system)
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (!authToken || !userEmail) {
      console.log(
        "Create Icon page - No auth token found, redirecting to login"
      );
      router.push("/login?redirect=icons/create");
      return;
    }

    const userData = {
      name: userName || "",
      email: userEmail || "",
      token: authToken,
    };

    setUser(userData);
    setLoading(false);
  }, [router]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await axios.get("/api/icons/search-wikipedia", {
        params: { q: searchTerm.trim(), limit: 10 },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search Wikipedia. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  const handleCreateIcon = async () => {
    if (!selectedPerson) return;

    setCreating(true);
    setError("");

    try {
      const iconData = {
        name: selectedPerson.title,
        wikipediaTitle: selectedPerson.title,
        wikipediaPageId: selectedPerson.pageId,
        description: selectedPerson.extract || "No description available",
        imageUrl: selectedPerson.imageUrl || "",
        occupation: selectedPerson.occupation || "Public Figure",
        birthDate: selectedPerson.birthDate || "",
        deathDate: selectedPerson.deathDate || "",
        nationality: "",
        characterType: selectedPerson.characterType || "real",
        isFictional: selectedPerson.isFictional || false,
        sourceMedia: selectedPerson.isFictional
          ? extractSourceMedia(selectedPerson.extract)
          : "",
      };

      const response = await axios.post("/api/icons", iconData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      // Redirect to the quiz page for this new icon
      router.push(`/icons/${response.data.icon._id}/quiz`);
    } catch (error) {
      console.error("Create icon error:", error);
      if (error.response?.data?.existingIcon) {
        setError(`This person already exists as an Icon. Redirecting...`);
        setTimeout(() => {
          router.push(`/icons/${error.response.data.existingIcon}`);
        }, 2000);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create Icon. Please try again."
        );
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SmallLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create New Icon - Philosiq Icons</title>
        <meta
          name="description"
          content="Create a new political profile for a famous person"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />

        {/* Header */}
        <div className=" mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-4">
              <Link
                href="/icons"
                className="flex items-center text-black/80 hover:text-black w-fit transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Icons
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">Create New Icon</h1>
            <p className="text-lg text-gray-600">
              Search for a famous person on Wikipedia to create their political
              profile
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!selectedPerson ? (
            <>
              {/* Search Form */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <form onSubmit={handleSearch}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="search"
                        className="block text-lg font-medium text-gray-900 mb-3"
                      >
                        Search for a person
                      </label>
                      <div className="relative">
                        <input
                          id="search"
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="e.g., Barack Obama, Albert Einstein, Harry Potter, Luke Skywalker..."
                          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent transition-shadow"
                          disabled={searching}
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={searching || !searchTerm.trim()}
                      className="sm:mt-12 px-8 py-4 bg-primary-maroon text-white rounded-lg hover:bg-primary-darkMaroon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 text-lg font-medium"
                    >
                      {searching ? (
                        <SmallLoader />
                      ) : (
                        <>
                          <FaSearch className="mr-2" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-secondary-darkBlue to-primary-maroon p-6 rounded-xl text-white flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Search Results
                      </h2>
                      <p className="text-white/90">
                        Select a person to create their Icon
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
                      {searchResults.length}{" "}
                      {searchResults.length === 1 ? "result" : "results"} found
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {searchResults.map((person) => (
                      <PersonCard
                        key={person.pageId}
                        person={person}
                        onSelect={handleSelectPerson}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Selected Person Confirmation */
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Confirm Icon Creation
                  </h2>
                  <p className="text-gray-600">
                    Review the information before creating the Icon
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  {selectedPerson.imageUrl ? (
                    <img
                      src={selectedPerson.imageUrl}
                      alt={selectedPerson.title}
                      className="w-32 h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaUser className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPerson.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-2">
                    {selectedPerson.occupation}
                  </p>
                  {(selectedPerson.birthDate || selectedPerson.deathDate) && (
                    <p className="text-sm text-gray-500 mb-4">
                      {selectedPerson.birthDate && selectedPerson.deathDate
                        ? `${selectedPerson.birthDate} - ${selectedPerson.deathDate}`
                        : selectedPerson.birthDate
                        ? `Born ${selectedPerson.birthDate}`
                        : `Died ${selectedPerson.deathDate}`}
                    </p>
                  )}
                  <p className="text-gray-700 mb-4">{selectedPerson.extract}</p>

                  {/* Validation Status */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      {selectedPerson.validation.isValid ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaTimes className="text-red-500 mr-2" />
                      )}
                      <span
                        className={`font-medium ${
                          selectedPerson.validation.isValid
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {selectedPerson.validation.isValid
                          ? "Suitable for Icon"
                          : "May not be suitable"}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({selectedPerson.validation.confidence}% confidence)
                      </span>
                    </div>
                    {selectedPerson.validation.reasons.length > 0 && (
                      <ul className="text-sm text-gray-600 ml-6">
                        {selectedPerson.validation.reasons.map(
                          (reason, index) => (
                            <li key={index} className="list-disc">
                              {reason}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleCreateIcon}
                      disabled={creating || !selectedPerson.validation.isValid}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {creating ? (
                        <SmallLoader />
                      ) : (
                        <FaCheck className="mr-2" />
                      )}
                      {creating
                        ? "Creating Icon..."
                        : "Create Icon & Take Quiz"}
                    </button>

                    <a
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                        selectedPerson.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      View on Wikipedia
                    </a>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PersonCard({ person, onSelect }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-primary-maroon"
      onClick={() => onSelect(person)}
    >
      <div className="flex gap-6">
        {/* Image */}
        <div className="flex-shrink-0">
          {person.imageUrl ? (
            <img
              src={person.imageUrl}
              alt={person.title}
              className="w-24 h-32 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
              <FaUser className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                {person.title}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-base text-gray-600">{person.occupation}</p>
                {person.isFictional && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Fictional Character
                  </span>
                )}
                {person.characterType === "real" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Real Person
                  </span>
                )}
              </div>
              {(person.birthDate || person.deathDate) && (
                <p className="text-sm text-gray-500 mb-3">
                  {person.birthDate && person.deathDate
                    ? `${person.birthDate} - ${person.deathDate}`
                    : person.birthDate
                    ? `Born ${person.birthDate}`
                    : `Died ${person.deathDate}`}
                </p>
              )}
              <p className="text-gray-700 line-clamp-2 leading-relaxed">
                {person.extract}
              </p>
            </div>

            {/* Validation Badge */}
            <div className="flex-shrink-0 ml-6">
              {person.validation.isValid ? (
                <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full flex items-center">
                  <FaCheck className="mr-1.5" />
                  <span className="text-sm font-medium">Suitable</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full flex items-center">
                  <FaTimes className="mr-1.5" />
                  <span className="text-sm font-medium">Review</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
