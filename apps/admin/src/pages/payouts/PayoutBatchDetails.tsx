import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { Api } from "../../lib/api";

export default function PayoutBatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/payouts/batches/${id}`);
      setBatch(res.batch ?? res.data ?? res);
    } catch (e) {
      console.error(e);
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }

  async function addPayoutToBatch() {
    const payoutId = prompt("Enter payout id to add to this batch:");
    if (!payoutId) return;
    await Api.post(`/admin/payouts/batches/${id}/add/${payoutId}`);
    load();
  }

  if (loading) return <Loading />;
  if (!batch) return <div>Batch not found</div>;

  return (
    <div>
      <PageTitle>Batch #{batch.id}</PageTitle>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div><strong>Total (KES):</strong> {(batch.totalCents / 100).toLocaleString()}</div>
        <div><strong>Created:</strong> {new Date(batch.createdAt).toLocaleString()}</div>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={addPayoutToBatch} className="px-3 py-2 bg-blue-600 text-white rounded">Add payout</button>
        <button onClick={() => navigate("/admin/payouts/batches")} className="px-3 py-2 border rounded">Back</button>
      </div>

      <div className="space-y-3">
        {batch.payouts?.length ? (
          batch.payouts.map((p: any) => (
            <div key={p.id} className="p-3 border rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{p.driver?.user?.name ?? p.driverId}</div>
                  <div className="text-sm text-gray-600">{(p.amountCents / 100).toLocaleString()} KES</div>
                </div>
                <div className="text-sm text-gray-600">{p.status}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No payouts in this batch yet.</div>
        )}
      </div>
    </div>
  );
}
