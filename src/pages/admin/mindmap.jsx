import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  FaTrash,
  FaFilter,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import { getSession } from "next-auth/react";

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

export default function AdminMindMap() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    archetype: "",
    education: "",
    gender: "",
    race: "",
    age: "",
    votingTendency: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Filter options
  const filterOptions = {
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
    age: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    votingTendency: ["Left Leaning", "Right Leaning", "Other/Independent"],
  };

  useEffect(() => {
    fetchMindMapData();
  }, [currentPage, filters]);

  const fetchMindMapData = async () => {
    setLoading(true);
    try {
      // Convert filters to query string, excluding empty values
      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const response = await fetch(
        `/api/admin/mindmap?page=${currentPage}&limit=${ITEMS_PER_PAGE}${
          filterParams ? `&${filterParams}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch MindMap data");
      }

      const data = await response.json();
      setEntries(data.entries);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      setTotalEntries(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/mindmap/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      // Refresh the data
      fetchMindMapData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedEntries.size} entries?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/mindmap/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedEntries),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete entries");
      }

      setSelectedEntries(new Set());
      fetchMindMapData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      archetype: "",
      education: "",
      gender: "",
      race: "",
      age: "",
      votingTendency: "",
    });
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedEntries.size === entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entries.map((entry) => entry._id)));
    }
  };

  const toggleEntrySelection = (id) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEntries(newSelected);
  };

  return (
    <AdminLayout title="MindMap Management">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MindMap Entries</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FaFilter /> Filters
            </button>
            {selectedEntries.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
                Delete Selected ({selectedEntries.size})
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(filterOptions).map(([field, options]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <select
                    value={filters[field]}
                    onChange={(e) => handleFilterChange(field, e.target.value)}
                    className="w-full p-2 border rounded-lg"
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-gray-600">Total entries: {totalEntries}</div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedEntries.size === entries.length &&
                      entries.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archetype
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <FaSpinner className="animate-spin inline-block mr-2" />
                    Loading...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  // Find the archetype code from the map
                  const archetypeInfo = ARCHETYPE_MAP.find(
                    (a) => a.label === entry.archetype
                  ) || { code: "Unknown" };

                  return (
                    <tr key={entry._id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEntries.has(entry._id)}
                          onChange={() => toggleEntrySelection(entry._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{entry.archetype}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {archetypeInfo.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p>Age: {entry.demographics.age}</p>
                          <p>Education: {entry.demographics.education}</p>
                          <p>Gender: {entry.demographics.gender}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(new Date(entry.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              <FaChevronLeft /> Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/auth/signin?callbackUrl=/admin/mindmap",
  //       permanent: false,
  //     },
  //   };
  // }

  // Add isAdmin to the session user object
  // if (session.user) {
  //   session.user.isAdmin = true; // For now, we'll assume all logged-in users are admins
  // }

  return {
    props: { session },
  };
}
