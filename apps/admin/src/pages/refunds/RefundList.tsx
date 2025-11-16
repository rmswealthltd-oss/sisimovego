import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function RefundList() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [sorting, setSorting] = useState({
    field: "createdAt",
    dir: "desc"
  });

  const [filters, setFilters] = useState({
    status: "",
    reason: "",
    from: "",
    to: "",
    search: ""
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [page, sorting, filters]);

  async function loadData() {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sortBy", sorting.field);
      params.set("sortDir", sorting.dir);

      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });

      const res = await Api.get(`/refunds?${params.toString()}`);

      setRefunds(res.items);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }

  function setFilter(key: string, value: string) {
    setPage(1);
    setFilters({ ...filters, [key]: value });
  }

  function toggleSort(field: string) {
    if (sorting.field === field) {
      setSorting({
        field,
        dir: sorting.dir === "asc" ? "desc" : "asc"
      });
    } else {
      setSorting({ field, dir: "asc" });
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <PageTitle>Refund Requests</PageTitle>

      {/* Filters */}
      <div className="bg-white p-4 mb-4 rounded shadow grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          placeholder="Search passenger/driver/trip"
          className="border px-3 py-2 rounded"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="">Status</option>
          <option value="open">Open</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="paid">Paid</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.reason}
          onChange={(e) => setFilter("reason", e.target.value)}
        >
          <option value="">Reason</option>
          <option value="driver_no_show">Driver No Show</option>
          <option value="overcharge">Overcharge</option>
          <option value="service_issue">Service Issue</option>
          <option value="duplicate_payment">Duplicate Payment</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filters.from}
          onChange={(e) => setFilter("from", e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filters.to}
          onChange={(e) => setFilter("to", e.target.value)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: "id",
                title: "ID",
                render: (r) => (
                  <Link className="text-blue-600 underline" to={`/refunds?id=${r.id}`}>
                    #{r.id}
                  </Link>
                )
              },
              {
                key: "tripId",
                title: "Trip",
                render: (r) => (
                  <Link className="text-blue-600 underline" to={`/trips?id=${r.tripId}`}>
                    Trip #{r.tripId}
                  </Link>
                )
              },
              {
                key: "passenger",
                title: "Passenger",
                render: (r) => r.passenger?.name ?? r.passenger?.email
              },
              {
                key: "amount",
                title: "Amount",
                render: (r) => `KES ${(r.amountCents / 100).toFixed(2)}`
              },
              {
                key: "status",
                title: "Status",
                render: (r) => (
                  <span className="px-2 py-1 rounded bg-gray-100 capitalize text-xs">
                    {r.status}
                  </span>
                )
              },
              {
                key: "reason",
                title: "Reason",
                render: (r) => r.reason.replace("_", " ")
              },
              {
                key: "createdAt",
                title: (
                  <button onClick={() => toggleSort("createdAt")}>
                    Created At {sorting.field === "createdAt" ? (sorting.dir === "asc" ? "▲" : "▼") : ""}
                  </button>
                ),
                render: (r) => new Date(r.createdAt).toLocaleString()
              }
            ]}
            data={refunds}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-40"
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <div>
              Page {page} / {totalPages || 1}
            </div>

            <button
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-40"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
