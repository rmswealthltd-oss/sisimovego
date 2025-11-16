import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";

export default function StripeReconciliation() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/finance/reconciliation/stripe");
      setRows(res.rows ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Stripe Reconciliation</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "stripeId", title: "Stripe ID" },
            { key: "amount", title: "Amount", render: (r) => `KES ${(r.amount / 100).toFixed(2)}` },
            { key: "status", title: "Status" },
            { key: "note", title: "Note" }
          ]}
          data={rows}
        />
      )}
    </div>
  );
}
