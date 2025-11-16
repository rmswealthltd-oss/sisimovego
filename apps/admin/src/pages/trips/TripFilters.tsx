import React from "react";

export default function TripFilters({
  value,
  onChange
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  function set(key: string, v: any) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="bg-white p-4 mb-4 rounded shadow grid grid-cols-1 md:grid-cols-5 gap-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="Driver ID"
        value={value.driverId}
        onChange={(e) => set("driverId", e.target.value)}
      />

      <input
        className="border px-3 py-2 rounded"
        placeholder="Passenger ID"
        value={value.passengerId}
        onChange={(e) => set("passengerId", e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded"
        value={value.status}
        onChange={(e) => set("status", e.target.value)}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="assigned">Assigned</option>
        <option value="enroute">En Route</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={value.from}
        onChange={(e) => set("from", e.target.value)}
      />

      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={value.to}
        onChange={(e) => set("to", e.target.value)}
      />
    </div>
  );
}
