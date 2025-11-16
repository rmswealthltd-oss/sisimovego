import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";

export default function LedgerViewer() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState("");

  useEffect(() => {
    load();
  }, [walletId]);

  async function load() {
    setLoading(true);
    try {
      const q = walletId ? `?walletId=${encodeURIComponent(walletId)}` : "?limit=100";
      const res = await Api.get(`/finance/ledger${q}`);
      setRows(res.rows ?? res.entries ?? []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Ledger</PageTitle>

      <div className="mb-4 flex gap-2 items-center">
        <input className="border px-3 py-2 rounded flex-1" placeholder="Wallet ID (optional)" value={walletId} onChange={(e) => setWalletId(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={load}>Load</button>
      </div>

      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "walletId", title: "Wallet" },
            { key: "bookingId", title: "Booking" },
            { key: "amount", title: "Amount", render: (r) => `KES ${(r.amount / 100).toFixed(2)}` },
            { key: "type", title: "Type" },
            { key: "description", title: "Description" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() }
          ]}
          data={rows}
        />
      )}
    </div>
  );
}
