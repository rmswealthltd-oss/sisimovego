import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";

export default function DLQList() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/admin/dlq");
      setRows(res);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function reprocess(id: string) {
    await Api.post("/admin/dlq/reprocess", { id });
    load();
  }

  return (
    <div>
      <PageTitle>Dead Letter Queue</PageTitle>
      {loading ? <Loading /> : (
        <>
          <Table
            columns={[
              { key: "id", title: "ID" },
              { key: "aggregateType", title: "Type" },
              { key: "payload", title: "Payload", render: (r) => <pre className="text-xs">{JSON.stringify(r.payload).slice(0, 200)}</pre> },
              { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() },
              { key: "actions", title: "Actions", render: (r) => <button className="text-blue-600" onClick={() => reprocess(r.id)}>Reprocess</button> }
            ]}
            data={rows}
          />
        </>
      )}
    </div>
  );
}
