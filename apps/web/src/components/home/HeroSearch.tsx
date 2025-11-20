"use client";

/**
 * HeroSearch — compact search with quick fare estimate
 * Reference: /mnt/data/components.docx
 */
import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

function estimateFare(from: string, to: string) {
  if (!from || !to) return null;
  const base = 500;
  const diff = Math.abs(from.length - to.length) * 100;
  return Math.max(350, Math.round((base + diff) / 50) * 50);
}

export default function HeroSearch() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const fare = estimateFare(from.trim(), to.trim());

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) return;
    router.push(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow border p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div className="md:col-span-1">
        <label className="text-sm font-medium">From</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="City or station" />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm font-medium">To</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="City or station" />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm font-medium">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="md:col-span-1 flex items-center gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold w-full">Search</button>
        <div className="hidden md:block text-sm text-gray-600">
          {fare ? <div>Est. KSh <span className="font-semibold">{fare}</span></div> : <div className="text-gray-400">Enter route</div>}
        </div>
      </div>

      {/* mobile fare view */}
      <div className="md:hidden mt-2 text-sm text-gray-600">
        {fare ? <div>Est. fare: KSh <span className="font-semibold">{fare}</span></div> : null}
      </div>
    </form>
  );
}
