"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();

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
    <section className="bg-white/95 backdrop-blur-md border rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Find your next trip</h2>
        <p className="text-sm text-gray-600">Book fast, safe and reliable rides.</p>
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* ORIGIN */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Origin</label>
          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
            <MapPin className="w-4 h-4 text-primary/80" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="City, landmark..."
              className="bg-transparent ml-2 outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Destination</label>
          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
            <MapPin className="w-4 h-4 text-primary/80" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="bg-transparent ml-2 outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* DATE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Travel Date</label>
          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
            <CalendarDays className="w-4 h-4 text-primary/80" />
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent ml-2 outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl w-full font-medium flex items-center justify-center gap-2 transition"
        >
          Search trips
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}
