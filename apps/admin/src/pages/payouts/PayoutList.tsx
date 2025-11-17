import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function PayoutList() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [filter]);

  async function load() {
    setLoading(true);
    try {
      const q = filter ? `?status=${encodeURIComponent(filter)}` : "";
      const res = await Api.get(`/admin/payouts${q}`);
      setPayouts(res.payouts ?? res.data ?? res);
    } catch (e) {
      console.error(e);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    if (!confirm("Approve this payout?")) return;
    await Api.post(`/admin/payouts/${id}/approve`);
    load();
  }

  async function reject(id: string) {
    if (!confirm("Reject this payout?")) return;
    await Api.post(`/admin/payouts/${id}/reject`);
    load();
  }

  async function markPaid(id: string) {
    const tx = prompt("Enter provider transaction id (providerTxId):");
    if (!tx) return;
    await Api.post(`/admin/payouts/${id}/mark-paid`, { providerTxId: tx });
    load();
  }

  return (
    <div>
      <PageTitle>Payouts</PageTitle>

      <div className="mb-4 flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="PAID">PAID</option>
        </select>

        <button
          onClick={() => navigate("/admin/payouts/batches")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          View Batches
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          data={payouts}
          columns={[
            {
              key: "id",
              title: "ID",
              render: (p) => <Link to={`/admin/payouts/${p.id}`}>#{p.id}</Link>,
            },
            { key: "driverId", title: "Driver", render: (p) => p.driver?.user?.name ?? p.driverId },
            {
              key: "amountCents",
              title: "Amount (KES)",
              render: (p) => (p.amountCents / 100).toLocaleString(),
            },
            { key: "status", title: "Status" },
            { key: "createdAt", title: "Created", render: (p) => new Date(p.createdAt).toLocaleString() },
            {
              key: "actions",
              title: "Actions",
              render: (p) => (
                <div className="flex gap-2">
                  <button onClick={() => approve(p.id)} className="text-green-600 hover:underline">Approve</button>
                  <button onClick={() => reject(p.id)} className="text-orange-600 hover:underline">Reject</button>
                  <button onClick={() => markPaid(p.id)} className="text-blue-600 hover:underline">Mark paid</button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
