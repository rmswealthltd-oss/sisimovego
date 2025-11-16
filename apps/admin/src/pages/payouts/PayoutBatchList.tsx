import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function PayoutBatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/payouts/batch");
      setBatches(res.batches ?? res.rows ?? []);
    } catch (e) {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Payout Batches</PageTitle>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            { key: "id", title: "Batch ID", render: (b) => <Link to={`/payouts/batch?id=${b.id}`}>#{b.id}</Link> },
            { key: "count", title: "Count", render: (b) => b.count ?? b.items?.length ?? 0 },
            { key: "total", title: "Total", render: (b) => `KES ${(b.totalAmount / 100).toFixed(2)}` },
            { key: "status", title: "Status", render: (b) => b.status },
            { key: "createdAt", title: "Created", render: (b) => new Date(b.createdAt).toLocaleString() }
          ]}
          data={batches}
        />
      )}
    </div>
  );
}
