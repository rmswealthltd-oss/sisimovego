import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function PayoutBatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(
        `/admin/payouts${q ? `?q=${encodeURIComponent(q)}` : ""}`
      );
      setBatches(res.batches ?? res);
    } catch (e) {
      console.error(e);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    if (!window.confirm("Approve this payout batch?")) return;
    try {
      await Api.post(`/admin/payouts/${id}/approve`);
      load();
    } catch {
      alert("Error approving payout");
    }
  }

  async function reject(id: string) {
    if (!window.confirm("Reject this payout batch?")) return;
    try {
      await Api.post(`/admin/payouts/${id}/reject`);
      load();
    } catch {
      alert("Error rejecting payout");
    }
  }

  return (
    <div>
      <PageTitle>Payout Batches</PageTitle>

      {/* Search bar */}
      <div className="mb-4 flex gap-2">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Search batchID / status"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={load}
        >
          Search
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            {
              id: "id",
              accessor: "id",
              title: "Batch ID",
              render: (b) => (
                <Link to={`/admin/payouts/details?id=${b.id}`}>#{b.id}</Link>
              ),
            },
            {
              id: "amount",
              accessor: "totalAmount",
              title: "Amount",
              render: (b) => `KSh ${b.totalAmount}`,
            },
            { id: "items", accessor: "itemsCount", title: "Items" },
            {
              id: "status",
              accessor: "status",
              title: "Status",
              render: (b) => (
                <span
                  className={
                    b.status === "PENDING"
                      ? "text-yellow-600"
                      : b.status === "APPROVED"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {b.status}
                </span>
              ),
            },
            {
              id: "createdAt",
              accessor: "createdAt",
              title: "Created",
              render: (b) => new Date(b.createdAt).toLocaleString(),
            },
            {
              id: "actions",
              title: "Actions",
              render: (b) => (
                <div className="flex gap-2">
                  <Link
                    to={`/admin/payouts/details?id=${b.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>
                </div>
              ),
            },
          ]}
          data={batches}
          loading={loading}
          total={batches.length}
          page={1}
          pageSize={100}
        />
      )}
    </div>
  );
}
