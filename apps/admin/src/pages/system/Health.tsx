import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";

export default function Health() {
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/health");
      setHealth(res);
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>System Health</PageTitle>
      <div className="bg-white p-4 rounded shadow">
        <pre className="text-sm">{JSON.stringify(health, null, 2)}</pre>
      </div>
    </div>
  );
}
