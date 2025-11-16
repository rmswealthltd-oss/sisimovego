import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function PayoutList() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    load();
  }, [status]);

  async function load() {
    setLoading(true);
    try {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      const res = await Api.get(`/payouts${q}`);
      setPayouts(res.payouts ?? res.rows ?? []);
    } catch (e) {
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Payouts</PageTitle>

      <div className="mb-4 flex gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="FAILED">Failed</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={[
            { key: "id", title: "Payout ID", render: (r) => <Link to={`/payouts/batch?id=${r.batchId}`}>#{r.id}</Link> },
            { key: "driverId", title: "Driver", render: (r) => <Link to={`/drivers/profile?id=${r.driverId}`}>#{r.driverId}</Link> },
            { key: "amount", title: "Amount", render: (r) => `KES ${(r.amount / 100).toFixed(2)}` },
            { key: "status", title: "Status", render: (r) => r.status },
            { key: "providerTxId", title: "Provider Tx", render: (r) => r.providerTxId ?? "—" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() }
          ]}
          data={payouts}
        />
      )}
    </div>
  );
}
