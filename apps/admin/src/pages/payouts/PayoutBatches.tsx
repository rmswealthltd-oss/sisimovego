import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function PayoutBatches() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/payouts/batches");
      setBatches(res.batches ?? res.data ?? res);
    } catch (e) {
      console.error(e);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function createBatch() {
    if (!confirm("Create new payout batch?")) return;
    await Api.post("/admin/payouts/batches");
    load();
  }

  return (
    <div>
      <PageTitle>Payout Batches</PageTitle>

      <div className="mb-4 flex gap-2">
        <button onClick={createBatch} className="px-3 py-2 bg-blue-600 text-white rounded">Create batch</button>
        <button onClick={() => navigate("/admin/payouts")} className="px-3 py-2 border rounded">Back to payouts</button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          data={batches}
          columns={[
            { key: "id", title: "Batch ID", render: (b) => <Link to={`/admin/payouts/batches/${b.id}`}>#{b.id}</Link> },
            { key: "totalCents", title: "Total (KES)", render: (b) => (b.totalCents / 100).toLocaleString() },
            { key: "createdAt", title: "Created", render: (b) => new Date(b.createdAt).toLocaleString() },
            { key: "actions", title: "", render: (b) => <Link to={`/admin/payouts/batches/${b.id}`} className="text-blue-600 hover:underline">View</Link> },
          ]}
        />
      )}
    </div>
  );
}
