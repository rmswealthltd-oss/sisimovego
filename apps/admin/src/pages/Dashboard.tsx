import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { Api } from "../lib/api";
import Loading from "../components/Loading";
import { format as fmt } from "date-fns";

export default function Dashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await Api.get("/admin/analytics/overview");
        setStats(res);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Overview</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-semibold">{stats?.users ?? "—"}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Drivers</div>
          <div className="text-2xl font-semibold">{stats?.drivers ?? "—"}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Revenue (KES)</div>
          <div className="text-2xl font-semibold">{(stats?.revenueCents ?? 0) / 100}</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Latest activity</div>
        <div className="mt-3 text-sm text-gray-700">This panel will show recent events and alerts — coming soon.</div>
      </div>
    </div>
  );
}
