"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow border flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
}
