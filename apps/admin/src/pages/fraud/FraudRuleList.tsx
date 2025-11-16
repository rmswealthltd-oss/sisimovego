import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function FraudRuleList() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/fraud/rules");
      setRules(res.rules ?? []);
    } catch (e) {
      setRules([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Fraud Rules</PageTitle>
      {loading ? <Loading /> : (
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "description", title: "Description" },
            { key: "weight", title: "Weight" },
            { key: "enabled", title: "Enabled", render: (r) => r.enabled ? "Yes" : "No" },
            { key: "actions", title: "Actions", render: (r) => <Link to={`/fraud/rules/${r.id}`}>Edit</Link> }
          ]}
          data={rules}
        />
      )}
    </div>
  );
}
