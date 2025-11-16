import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function FraudCaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/fraud/cases");
      setCases(res.cases ?? []);
    } catch (e) {
      setCases([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Fraud Cases</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "subject", title: "Subject" },
            { key: "score", title: "Score" },
            { key: "status", title: "Status" },
            { key: "createdAt", title: "Created", render: (r) => new Date(r.createdAt).toLocaleString() },
            { key: "actions", title: "Actions", render: (r) => <Link to={`/fraud/cases/${r.id}`}>View</Link> }
          ]}
          data={cases}
        />
      )}
    </div>
  );
}
