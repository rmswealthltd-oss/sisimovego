"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatISO } from "date-fns";

export default function HeroSearch() {
  const router = useRouter();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<string>(
    formatISO(new Date(), { representation: "date" })
  );

  function submit(e?: React.FormEvent) {
    e?.preventDefault();

    // Ensure required fields
    if (!origin.trim() || !destination.trim()) return;

    const q = new URLSearchParams();
    q.set("origin", origin);
    q.set("destination", destination);
    q.set("date", date);

    router.push(`/results?${q.toString()}`);
  }

  return (
    <section className="bg-gradient-to-r from-sky-50 to-white rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Find your next trip</h2>
        <p className="text-sm text-gray-600">
          Safe, fast and reliable rides across Africa.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        {/* ORIGIN */}
        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origin (city, landmark)"
          className="border p-3 rounded-lg text-sm w-full"
        />

        {/* DESTINATION */}
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="border p-3 rounded-lg text-sm w-full"
        />

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-3 rounded-lg text-sm w-full"
        />

        {/* BUTTON */}
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
