import React from "react";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <div className="p-4 bg-white rounded shadow flex items-center space-x-3">
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
