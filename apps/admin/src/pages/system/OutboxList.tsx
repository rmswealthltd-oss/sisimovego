import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";

export default function OutboxList() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/outbox"); // ensure route exists or implement proxy
      setRows(res);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Outbox</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "aggregateType", title: "Aggregate" },
            { key: "type", title: "Type" },
            { key: "payload", title: "Payload", render: (r) => <pre className="text-xs">{JSON.stringify(r.payload).slice(0,200)}</pre> },
            { key: "status", title: "Status" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() }
          ]}
          data={rows}
        />
      )}
    </div>
  );
}
