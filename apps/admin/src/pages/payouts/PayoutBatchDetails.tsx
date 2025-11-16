import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";

export default function PayoutBatchDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [batch, setBatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/payouts/batch/${id}`);
      setBatch(res.batch ?? res);
    } catch (e) {
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!batch) return <div>Batch not found</div>;

  return (
    <div>
      <PageTitle>Payout Batch #{batch.id}</PageTitle>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Count:</strong> {batch.items?.length ?? batch.count}</div>
          <div><strong>Total:</strong> KES {(batch.totalAmount / 100).toFixed(2)}</div>
          <div><strong>Status:</strong> {batch.status}</div>
          <div><strong>Created:</strong> {new Date(batch.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <Table
        columns={[
          { key: "id", title: "Payout ID", render: (r) => <Link to={`/payouts?id=${r.id}`}>#{r.id}</Link> },
          { key: "driverId", title: "Driver", render: (r) => <Link to={`/drivers/profile?id=${r.driverId}`}>#{r.driverId}</Link> },
          { key: "amount", title: "Amount", render: (r) => `KES ${(r.amount / 100).toFixed(2)}` },
          { key: "status", title: "Status", render: (r) => r.status },
          { key: "providerTxId", title: "Provider Tx", render: (r) => r.providerTxId ?? "—" }
        ]}
        data={batch.items ?? []}
      />
    </div>
  );
}
