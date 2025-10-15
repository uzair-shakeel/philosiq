import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { FaSearch, FaPlus, FaUser, FaCalendar, FaGlobe } from 'react-icons/fa';
import Navbar from '../components/Navbar';

export default function IconsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
      const response = await axios.get('/api/icons', {
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm || undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
      });
      setIcons(response.data.icons);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching icons:', error);
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
      router.push('/login?redirect=icons/create');
      return;
    }
    router.push('/icons/create');
  };

  return (
    <>
      <Head>
        <title>Philosiq Icons - Political Profiles of Famous People</title>
        <meta name="description" content="Explore the political compass positions of famous historical and contemporary figures based on community-sourced answers." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />

        {/* Header */}
        <div className="bg-white shadow-sm border-b mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Philosiq Icons</h1>
                <p className="mt-2 text-gray-600">
                  Explore the political compass positions of famous people based on community research
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Create New Icon
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for existing icons..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Icons Grid */}
          {!loading && (
            <>
              {icons.length === 0 ? (
                <div className="text-center py-12">
                  <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No icons found' : 'No icons yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? 'Try a different search term or create a new icon.'
                      : 'Be the first to create an icon for a famous person!'}
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Create First Icon
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {icons.map((icon) => (
                    <IconCard key={icon._id} icon={icon} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg border ${
                          page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                      disabled={currentPage === pagination.pages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function IconCard({ icon }) {
  const axisLabels = {
    equityVsFreeMarket: 'Equity ↔ Free Market',
    libertarianVsAuthoritarian: 'Libertarian ↔ Authoritarian',
    progressiveVsConservative: 'Progressive ↔ Conservative',
    secularVsReligious: 'Secular ↔ Religious',
    globalismVsNationalism: 'Globalism ↔ Nationalism',
  };

  const getScoreColor = (score) => {
    if (score > 20) return 'text-blue-600';
    if (score < -20) return 'text-red-600';
    return 'text-gray-600';
  };

  // Confidence removed from product; no indicator required

  return (
    <Link href={`/icons/${icon._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Image */}
        <div className="aspect-w-3 aspect-h-4 bg-gray-200">
          {icon.imageUrl ? (
            <img
              src={icon.imageUrl}
              alt={icon.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
              <FaUser className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{icon.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{icon.occupation}</p>
          
          {/* Birth/Death dates */}
          {(icon.birthDate || icon.deathDate) && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <FaCalendar className="mr-1" />
              {icon.birthDate && icon.deathDate 
                ? `${icon.birthDate} - ${icon.deathDate}`
                : icon.birthDate 
                ? `Born ${icon.birthDate}`
                : `Died ${icon.deathDate}`}
            </div>
          )}

          {/* Political Axes */}
          <div className="space-y-2">
            {Object.entries(icon.scores || {}).map(([axis, score]) => (
              <div key={axis} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate flex-1 mr-2">
                  {axisLabels[axis]?.split(' ↔ ')[0]}
                </span>
                <span className={`font-medium ${getScoreColor(score)}`}>
                  {score > 0 ? '+' : ''}{score}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{icon.totalAnswers || 0} answers</span>
            <span />
          </div>
        </div>
      </div>
    </Link>
  );
}
