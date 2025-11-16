import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";

export default function Config() {
  const [config, setConfig] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/system/config");
      setConfig(res.config ?? res);
    } catch {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }

  async function reload() {
    setReloading(true);
    try {
      await Api.post("/system/config/reload");
      alert("Reload requested");
    } catch (e) {
      alert("Failed");
    } finally {
      setReloading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Runtime Config</PageTitle>

      <div className="bg-white p-4 rounded shadow">
        <pre className="text-sm">{JSON.stringify(config, null, 2)}</pre>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={reload} disabled={reloading}>
            {reloading ? "Requesting..." : "Request Reload"}
          </button>
        </div>
      </div>
    </div>
  );
}
