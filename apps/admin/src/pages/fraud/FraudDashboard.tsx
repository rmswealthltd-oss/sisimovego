import React from "react";
import StatCard from "../../components/StatCard"; // adjust path if needed

export default function FraudDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Fraud Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Alerts" value={23} icon="⚠️" />
        <StatCard title="Open Cases" value={5} icon="📁" />
        <StatCard title="Rules Triggered Today" value={12} icon="🛑" />
      </div>

      {/* more dashboard sections */}
    </div>
  );
}
