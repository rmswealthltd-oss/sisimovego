import { useEffect, useState, useMemo } from "react";
import { Api } from "@/lib/api";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Link } from "react-router-dom";

// Export helpers
import {
  exportCSV,
  exportExcel,
  exportPDF,
  exportJSON,
  downloadFile,
} from "@/utils/download";

export default function BookingList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting
  const [sortKey, setSortKey] = useState<keyof any>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Bulk actions
  const [selected, setSelected] = useState<string[]>([]);

  // Auto-refresh every 30s
  useEffect(() => {
    loadBookings();
    const timer = setInterval(loadBookings, 30000);
    return () => clearInterval(timer);
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/bookings");
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------ */
  /* Filter + Sort + Paginate */
  /* ------------------------------------------------------------ */

  const filtered = useMemo(() => {
    return data
      .filter((b) => {
        if (search) {
          const s = search.toLowerCase();
          if (
            !(
              b.id.toString().includes(s) ||
              b.user?.name?.toLowerCase().includes(s) ||
              b.trip?.id?.toString().includes(s)
            )
          ) {
            return false;
          }
        }

        if (startDate && new Date(b.createdAt) < new Date(startDate)) return false;
        if (endDate && new Date(b.createdAt) > new Date(endDate)) return false;

        return true;
      })
      .sort((a, b) => {
        const A = a[sortKey];
        const B = b[sortKey];
        return sortDir === "asc" ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
      });
  }, [data, search, startDate, endDate, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else setSortKey(key as any);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ------------------------------------------------------------ */
  /* Bulk Actions */
  /* ------------------------------------------------------------ */

  async function bulkMarkPaid() {
    await Api.post("/admin/bookings/bulk-mark-paid", { ids: selected });
    loadBookings();
  }

  async function bulkDelete() {
    await Api.post("/admin/bookings/bulk-delete", { ids: selected });
    loadBookings();
  }

  async function bulkNotify() {
    await Api.post("/admin/bookings/bulk-notify", { ids: selected });
    alert("Notifications sent");
  }

  /* ------------------------------------------------------------ */
  /* PDF Invoice (single booking) */
  /* ------------------------------------------------------------ */
  function downloadInvoice(b: any) {
    const invoiceText = `
      Invoice for Booking #${b.id}
      ---------------------------
      User: ${b.user?.name}
      Trip: ${b.trip?.id}
      Status: ${b.status}
      Total: KES ${(b.totalCents / 100).toFixed(2)}
      Date: ${new Date(b.createdAt).toLocaleString()}
    `;
    downloadFile(`invoice-${b.id}.txt`, invoiceText);
  }

  /* ------------------------------------------------------------ */

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Bookings</PageTitle>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mt-4 grid gap-3 md:grid-cols-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search..."
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
          onClick={() => exportCSV("bookings.csv", filtered)}
        >
          Export CSV
        </button>

        <button
          className="px-3 py-2 bg-green-700 text-white rounded"
          onClick={() => exportExcel("bookings.xlsx", filtered)}
        >
          Export Excel
        </button>

        <button
          className="px-3 py-2 bg-red-700 text-white rounded"
          onClick={() => exportPDF("bookings.pdf", filtered)}
        >
          Export PDF
        </button>

        <button
          className="px-3 py-2 bg-indigo-700 text-white rounded"
          onClick={() => exportJSON("bookings.json", filtered)}
        >
          Export JSON
        </button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="my-4 bg-yellow-100 p-3 rounded flex gap-3">
          <span>{selected.length} selected</span>

          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={bulkMarkPaid}
          >
            Mark Paid
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={bulkNotify}
          >
            Notify
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
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th></th>
              <th onClick={() => toggleSort("id")}>ID</th>
              <th>User</th>
              <th>Trip</th>
              <th onClick={() => toggleSort("status")}>Status</th>
              <th onClick={() => toggleSort("totalCents")}>Total</th>
              <th onClick={() => toggleSort("createdAt")}>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((b) => (
              <tr key={b.id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(b.id)}
                    onChange={() => toggleSelect(b.id)}
                  />
                </td>

                <td>
                  <Link to={`/admin/bookings/${b.id}`} className="text-blue-600">
                    {b.id}
                  </Link>
                </td>

                <td>{b.user?.name}</td>
                <td>{b.trip?.id}</td>
                <td>{b.status}</td>
                <td>{(b.totalCents / 100).toFixed(2)}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>

                <td className="flex gap-2">
                  <Link
                    to={`/admin/bookings/${b.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>

                  <button
                    className="text-green-600 underline"
                    onClick={() => downloadInvoice(b)}
                  >
                    Invoice
                  </button>
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
