import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getSession } from "next-auth/react";
import axios from "axios";
import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function AdminIconsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchIcons = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/admin/icons", {
        params: { page, limit, search, includeInactive: "true" },
      });
      if (res.data.success) {
        setItems(res.data.data);
        setTotal(res.data.pagination.total);
      } else {
        setError("Failed to load icons");
      }
    } catch (e) {
      setError("Failed to load icons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, [page, limit]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIcons();
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      await axios.delete(`/api/admin/icons/${id}?hard=true`);
      setConfirmId(null);
      fetchIcons();
    } catch (e) {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      setTogglingId(id);
      await axios.patch(`/api/admin/icons/${id}`, { isActive });
      fetchIcons();
    } catch (e) {
      setError("Failed to update active state");
    } finally {
      setTogglingId(null);
    }
  };

  const pages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout title="Manage Icons">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Icons</h1>
        <p className="text-gray-600">Review and delete icons</p>
      </div>

      <form onSubmit={onSearch} className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center border rounded px-3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            className="w-full py-2 outline-none"
            placeholder="Search by name, title, occupation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-primary-maroon text-white px-4 rounded"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="bg-white rounded shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Icon</th>
                <th className="p-3">Occupation</th>
                <th className="p-3">Active</th>
                <th className="p-3">Answers</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6 text-center" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6 text-center" colSpan={6}>
                    No icons found
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {it.imageUrl ? (
                          <img src={it.imageUrl} alt={it.name} className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-gray-100 rounded" />
                        )}
                        <div>
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-xs text-gray-500">{it.wikipediaTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{it.occupation || "—"}</td>
                    <td className="p-3">
                      <div className="relative inline-flex items-center gap-2">
                        
                        <select
                          className="text-xs border rounded px-2 py-1"
                          value={it.isActive ? "active" : "inactive"}
                          disabled={togglingId === it._id}
                          onChange={(e) => handleToggleActive(it._id, e.target.value === "active")}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-3">{it.totalAnswers ?? 0}</td>
                    <td className="p-3">{new Date(it.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/icons/${it._id}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={() => setConfirmId(it._id)}
                          className="text-red-600 hover:underline flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3">
          <div className="text-sm text-gray-600">
            Page {page} of {pages} • {total} total
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Permanently Delete Icon</h3>
            <p className="text-gray-600 mb-4">
              This will permanently remove the icon and related answers from the database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => handleDelete(confirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // Enforce admin only access on server
  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/icons",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}
