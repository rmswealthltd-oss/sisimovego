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
      const q = walletId
        ? `?walletId=${encodeURIComponent(walletId)}`
        : "?limit=100";
      const res = await Api.get(`/finance/ledger${q}`);
      setRows(res.rows ?? res.entries ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Ledger</PageTitle>

      <div className="mb-4 flex gap-2 items-center">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Wallet ID (optional)"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={load}
        >
          Load
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table<any>
          data={rows}
          total={rows.length}
          page={1}
          pageSize={1000}
          columns={[
            { id: "col-id", accessor: "id", title: "ID" },

            { id: "col-wallet", accessor: "walletId", title: "Wallet" },

            { id: "col-booking", accessor: "bookingId", title: "Booking" },

            {
              id: "col-amount",
              accessor: "amount",
              title: "Amount",
              render: (row) =>
                row.amount != null
                  ? `KES ${(row.amount / 100).toFixed(2)}`
                  : "—",
            },

            { id: "col-type", accessor: "type", title: "Type" },

            { id: "col-description", accessor: "description", title: "Description" },

            {
              id: "col-created",
              accessor: "createdAt",
              title: "Created",
              render: (row) =>
                row.createdAt
                  ? new Date(row.createdAt).toLocaleString()
                  : "—",
            },
          ]}
        />
      )}
    </div>
  );
}
