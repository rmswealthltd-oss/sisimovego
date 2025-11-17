import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { Api } from "../../lib/api";

export default function PayoutDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payout, setPayout] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/payouts/${id}`);
      setPayout(res.payout ?? res.data ?? res);
    } catch (e) {
      console.error(e);
      setPayout(null);
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!confirm("Approve payout?")) return;
    await Api.post(`/admin/payouts/${id}/approve`);
    load();
  }

  async function reject() {
    if (!confirm("Reject payout?")) return;
    await Api.post(`/admin/payouts/${id}/reject`);
    load();
  }

  async function markPaid() {
    const providerTxId = prompt("Enter provider transaction id:");
    if (!providerTxId) return;
    await Api.post(`/admin/payouts/${id}/mark-paid`, { providerTxId });
    load();
  }

  if (loading) return <Loading />;
  if (!payout) return <div>Payout not found</div>;

  return (
    <div>
      <PageTitle>Payout #{payout.id}</PageTitle>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div><strong>Driver:</strong> {payout.driver?.user?.name ?? payout.driverId}</div>
        <div><strong>Amount (KES):</strong> {(payout.amountCents / 100).toLocaleString()}</div>
        <div><strong>Status:</strong> {payout.status}</div>
        <div><strong>Batch:</strong> {payout.batch?.id ?? "—"}</div>
        <div><strong>Provider Tx:</strong> {payout.providerTxId ?? "—"}</div>
        <div><strong>Created:</strong> {new Date(payout.createdAt).toLocaleString()}</div>
      </div>

      <div className="flex gap-3">
        <button onClick={approve} className="px-3 py-2 bg-green-600 text-white rounded">Approve</button>
        <button onClick={reject} className="px-3 py-2 bg-orange-600 text-white rounded">Reject</button>
        <button onClick={markPaid} className="px-3 py-2 bg-blue-600 text-white rounded">Mark Paid</button>
        <button onClick={() => navigate("/admin/payouts")} className="px-3 py-2 border rounded">Back</button>
      </div>
    </div>
  );
}
