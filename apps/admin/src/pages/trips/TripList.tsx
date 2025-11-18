import { useEffect, useState, useMemo } from "react";
import { Api } from "../../lib/api";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";

// Export helpers
import {
  exportCSV,
  exportExcel,
  exportPDF,
  exportJSON,
  downloadFile,
} from "@/utils/download";

export default function TripList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting
  const [sortKey, setSortKey] = useState("departureAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Bulk actions
  const [selected, setSelected] = useState<string[]>([]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadTrips();
    const timer = setInterval(loadTrips, 30000);
    return () => clearInterval(timer);
  }, []);

  async function loadTrips() {
    setLoading(true);
    try {
      const res = await Api.get("/trips");
      setData(res.trips ?? res.rows ?? res ?? []);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------ */
  /* Filter / Sort / Paginate */
  /* ------------------------------------------------------------ */

  const filtered = useMemo(() => {
    return data
      .filter((t) => {
        if (search) {
          const s = search.toLowerCase();
          const match =
            t.id?.toString().includes(s) ||
            t.origin?.toLowerCase().includes(s) ||
            t.destination?.toLowerCase().includes(s) ||
            t.status?.toLowerCase().includes(s);
          if (!match) return false;
        }

        if (startDate && new Date(t.departureAt) < new Date(startDate)) return false;
        if (endDate && new Date(t.departureAt) > new Date(endDate)) return false;

        return true;
      })
      .sort((a, b) => {
        const A = a[sortKey];
        const B = b[sortKey];
        return sortDir === "asc" ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
      });
  }, [data, search, startDate, endDate, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ------------------------------------------------------------ */
  /* Bulk Actions */
  /* ------------------------------------------------------------ */

  async function bulkActivate() {
    await Api.post("/admin/trips/bulk-activate", { ids: selected });
    loadTrips();
  }

  async function bulkDeactivate() {
    await Api.post("/admin/trips/bulk-deactivate", { ids: selected });
    loadTrips();
  }

  async function bulkDelete() {
    await Api.post("/admin/trips/bulk-delete", { ids: selected });
    loadTrips();
  }

  /* ------------------------------------------------------------ */

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Trips</PageTitle>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mt-4 grid gap-3 md:grid-cols-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search: origin, destination, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white rounded px-4"
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Export Buttons */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          className="px-3 py-2 bg-gray-700 text-white rounded"
          onClick={() => exportCSV("trips.csv", filtered)}
        >
          Export CSV
        </button>

        <button
          className="px-3 py-2 bg-green-700 text-white rounded"
          onClick={() => exportExcel("trips.xlsx", filtered)}
        >
          Export Excel
        </button>

        <button
          className="px-3 py-2 bg-red-700 text-white rounded"
          onClick={() => exportPDF("trips.pdf", filtered)}
        >
          Export PDF
        </button>

        <button
          className="px-3 py-2 bg-indigo-700 text-white rounded"
          onClick={() => exportJSON("trips.json", filtered)}
        >
          Export JSON
        </button>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="my-4 bg-yellow-100 p-3 rounded flex gap-3">
          <span>{selected.length} selected</span>

          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={bulkActivate}
          >
            Activate
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={bulkDeactivate}
          >
            Deactivate
          </button>

          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={bulkDelete}
          >
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-4 rounded shadow mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <th></th>
              <th onClick={() => toggleSort("id")}>ID</th>
              <th onClick={() => toggleSort("origin")}>Origin</th>
              <th onClick={() => toggleSort("destination")}>Destination</th>
              <th onClick={() => toggleSort("departureAt")}>Departure</th>
              <th onClick={() => toggleSort("seatsAvailable")}>Seats</th>
              <th onClick={() => toggleSort("status")}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(t.id)}
                    onChange={() => toggleSelect(t.id)}
                  />
                </td>

                <td>
                  <Link to={`/trips?id=${t.id}`} className="text-blue-600">
                    #{t.id}
                  </Link>
                </td>

                <td>{t.origin}</td>
                <td>{t.destination}</td>
                <td>{new Date(t.departureAt).toLocaleString()}</td>
                <td>{t.seatsAvailable}</td>
                <td>{t.status}</td>

                <td>
                  <Link
                    to={`/admin/trips/${t.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <span>
            Page {page} / {Math.ceil(filtered.length / pageSize)}
          </span>

          <button
            disabled={page * pageSize >= filtered.length}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
