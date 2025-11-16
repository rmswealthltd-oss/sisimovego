import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{title}</div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </div>

      {icon && (
        <div className="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
      )}
    </div>
  );
}
