import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function ReconciliationDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get("/finance/reconciliation/overview");
      setStats(res);
    } catch (e) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle>Reconciliation</PageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="MPESA Unmatched" value={stats?.mpesaUnmatched ?? 0} />
        <StatCard title="Stripe Unmatched" value={stats?.stripeUnmatched ?? 0} />
        <StatCard title="Pending Settlements" value={stats?.pending ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">MPESA</h4>
          <div><Link to="/reconciliation/mpesa" className="text-blue-600 underline">Go to MPESA reconciliation</Link></div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Stripe</h4>
          <div><Link to="/reconciliation/stripe" className="text-blue-600 underline">Go to Stripe reconciliation</Link></div>
        </div>
      </div>
    </div>
  );
}
