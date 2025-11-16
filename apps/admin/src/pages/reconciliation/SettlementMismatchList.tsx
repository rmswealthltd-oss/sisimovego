import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";

export default function SettlementMismatchList() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/finance/reconciliation/mismatches");
      setRows(res.rows ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Settlement Mismatches</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "expected", title: "Expected", render: (r) => `KES ${(r.expected / 100).toFixed(2)}` },
            { key: "actual", title: "Actual", render: (r) => `KES ${(r.actual / 100).toFixed(2)}` },
            { key: "diff", title: "Difference", render: (r) => `KES ${((r.actual - r.expected) / 100).toFixed(2)}` },
            { key: "note", title: "Note" }
          ]}
          data={rows}
        />
      )}
    </div>
  );
}
