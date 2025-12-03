"use client";

import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import { storage } from "@/lib/storage";
import dynamic from "next/dynamic";

// Dynamically import Recharts components to avoid HMR/SSR issues
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });

export function StatChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = storage.get<string>("token");
    if (!token) return;

    Api.get<any[]>("/analytics/trips/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((chartData) => setData(chartData))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white border rounded-xl shadow p-5 h-64">
      <h3 className="font-semibold mb-3">Trips Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
