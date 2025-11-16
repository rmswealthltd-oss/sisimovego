import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { Api } from "../../lib/api";

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/fraud/alerts");
      setAlerts(res.alerts ?? []);
    } catch (e) {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Fraud Alerts</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "type", title: "Type" },
            { key: "summary", title: "Summary" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() }
          ]}
          data={alerts}
        />
      )}
    </div>
  );
}
