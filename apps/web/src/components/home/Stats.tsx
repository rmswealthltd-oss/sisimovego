"use client";

/**
 * Stats — compact counters
 * Reference: /mnt/data/components.docx
 */

import { useEffect, useState } from "react";

export default function Stats() {
  const [s, setS] = useState({ users: 72000, trips: 310000, rating: 4.8 });

  useEffect(() => {
    const t = setTimeout(() => setS({ users: 80450, trips: 372120, rating: 4.9 }), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow border p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div>
        <div className="text-2xl md:text-3xl font-bold">{s.users.toLocaleString()}</div>
        <div className="text-sm text-gray-500">Registered users</div>
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-bold">{s.trips.toLocaleString()}</div>
        <div className="text-sm text-gray-500">Trips completed</div>
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-bold">{s.rating.toFixed(1)}★</div>
        <div className="text-sm text-gray-500">Average rating</div>
      </div>
    </div>
  );
}
