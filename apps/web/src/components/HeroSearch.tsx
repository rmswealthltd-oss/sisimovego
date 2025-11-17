"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const router = useRouter();

  // Native, stable date (no date-fns)
  const today = new Date().toISOString().split("T")[0];

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(today);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!origin.trim() || !destination.trim()) return;

    const q = new URLSearchParams();
    q.set("origin", origin.trim());
    q.set("destination", destination.trim());
    q.set("date", date);

    router.push(`/results?${q.toString()}`);
  }

  return (
    <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Find your next trip</h2>
        <p className="text-sm text-gray-600">
          Enter your route and travel date to get started.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origin (city, landmark)"
          className="border p-3 rounded-lg text-sm w-full"
        />

        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="border p-3 rounded-lg text-sm w-full"
        />

        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="border p-3 rounded-lg text-sm w-full"
        />

        <button
          type="submit"
          className="bg-primary text-white px-4 py-3 rounded-lg w-full font-medium"
        >
          Search trips
        </button>
      </form>
    </section>
  );
}
