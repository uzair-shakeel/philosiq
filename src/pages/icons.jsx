import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { FaSearch, FaPlus, FaUser, FaCalendar, FaGlobe } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function IconsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

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

    fetchIcons();
  }, [currentPage, searchTerm]);

  const fetchIcons = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/icons", {
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });
      setIcons(response.data.icons);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching icons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchIcons();
  };

  const handleCreateNew = () => {
    if (!user) {
      router.push("/login?redirect=icons/create");
      return;
    }
    router.push("/icons/create");
  };

  return (
    <>
      <Head>
        <title>Philosiq Icons - Political Profiles of Famous People</title>
        <meta
          name="description"
          content="Explore the political compass positions of famous historical and contemporary figures based on community-sourced answers."
        />
      </Head>

      <div className="min-h-screen pt-24 pb-16 bg-neutral-light">
        <Navbar user={user} />

        <div className="container-custom">
          <div className="">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Explore Political Icons
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the political compass positions of influential figures
                throughout history
              </p>
            </div>

            {/* Action Cards */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Search Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-secondary-darkBlue text-white p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Search Icons</h2>
                    <FaSearch className="text-3xl" />
                  </div>
                  <p className="text-sm opacity-90">
                    Find existing political profiles
                  </p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name..."
                      className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary-darkBlue focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full bg-secondary-darkBlue hover:bg-secondary-blue text-white font-bold py-3 px-4 rounded transition-colors duration-300"
                    >
                      Search Icons
                    </button>
                  </form>
                </div>
              </div>

              {/* Create Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-primary-maroon text-white p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create New Icon</h2>
                    <FaPlus className="text-3xl" />
                  </div>
                  <p className="text-sm opacity-90">
                    Add a new political profile
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Contribute to our database by creating a new icon profile
                    for a historical or contemporary figure.
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="w-full bg-primary-maroon hover:bg-primary-darkMaroon text-white font-bold py-3 px-4 rounded transition-colors duration-300"
                  >
                    Create Icon
                  </button>
                </div>
              </div>
            </div>

            {/* Section Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-secondary-darkBlue to-primary-maroon rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {searchTerm ? "Search Results" : "Popular Icons"}
                    </h2>
                    <p className="text-gray-100 text-sm opacity-90">
                      {searchTerm
                        ? "Icons matching your search criteria"
                        : "Most engaged political profiles and their positions"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white text-sm font-medium">
                      {icons.length} {icons.length === 1 ? "icon" : "icons"}{" "}
                      found
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-maroon border-opacity-20"></div>
                  <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary-maroon"></div>
                </div>
                <p className="mt-4 text-gray-500">Loading icons...</p>
              </div>
            )}

            {/* Icons Grid */}
            {!loading && (
              <div className="space-y-8">
                {icons.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm">
                      <div className="mb-6 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <FaUser className="h-10 w-10 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchTerm ? "No icons found" : "No icons yet"}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {searchTerm
                          ? "Try a different search term or create a new icon."
                          : "Be the first to create an icon for a famous person!"}
                      </p>
                      <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center px-6 py-3 bg-primary-maroon text-white rounded-lg hover:bg-primary-darkMaroon transition-all duration-300 transform hover:scale-105 font-bold shadow-md hover:shadow-lg"
                      >
                        <FaPlus className="mr-2" />
                        Create First Icon
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {icons.map((icon) => (
                      <IconCard key={icon._id} icon={icon} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="border-t border-gray-200 px-6 py-4 mt-6">
                    <nav className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-secondary-darkBlue disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>

                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            page === currentPage
                              ? "bg-secondary-darkBlue text-white"
                              : "text-gray-700 hover:text-secondary-darkBlue"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(pagination.pages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === pagination.pages}
                        className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-secondary-darkBlue disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function IconCard({ icon }) {
  const axisLabels = {
    equityVsFreeMarket: "Equity ↔ Free Market",
    libertarianVsAuthoritarian: "Libertarian ↔ Authoritarian",
    progressiveVsConservative: "Progressive ↔ Conservative",
    secularVsReligious: "Secular ↔ Religious",
    globalismVsNationalism: "Globalism ↔ Nationalism",
  };

  const getScoreColor = (score) => {
    if (score > 20) return "text-primary-maroon";
    if (score < -20) return "text-secondary-darkBlue";
    return "text-gray-600";
  };

  return (
    <Link href={`/icons/${icon._id}`}>
      <div className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col h-full transform hover:-translate-y-1">
        <div className="flex p-6">
          {/* Image */}
          <div className="flex-shrink-0">
            {icon.imageUrl ? (
              <img
                src={icon.imageUrl}
                alt={icon.name}
                className="w-24 h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            ) : (
              <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center">
                <FaUser className="h-8 w-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="ml-6 flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-secondary-darkBlue transition-colors mb-1">
              {icon.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{icon.occupation}</p>

            {/* Birth/Death dates */}
            {(icon.birthDate || icon.deathDate) && (
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                {icon.birthDate && icon.deathDate
                  ? `${icon.birthDate} - ${icon.deathDate}`
                  : icon.birthDate
                  ? `Born ${icon.birthDate}`
                  : `Died ${icon.deathDate}`}
              </div>
            )}
          </div>
        </div>

        {/* Political Axes */}
        <div className="mt-auto border-t border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {Object.entries(icon.scores || {}).map(([axis, score]) => (
                <div key={axis} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate mr-3">
                    {axisLabels[axis]?.split(" ↔ ")[0]}
                  </span>
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      score
                    )} px-2 py-0.5 rounded-full bg-opacity-10 ${
                      score > 20
                        ? "bg-primary-maroon"
                        : score < -20
                        ? "bg-secondary-darkBlue"
                        : ""
                    }`}
                  >
                    {score > 0 ? "+" : ""}
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {icon.totalAnswers || 0} answers
          </span>
          <span className="inline-flex items-center text-sm font-semibold text-secondary-darkBlue group-hover:translate-x-1 transition-transform duration-300">
            View Profile <span className="ml-2">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
