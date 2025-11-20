"use client";

/**
 * HeroBanner — bold, split layout with preview card
 * Reference: /mnt/data/components.docx
 */

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [drivers, setDrivers] = useState(1100);
  useEffect(() => {
    const t = setTimeout(() => setDrivers(1284), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 md:py-28">
      <div className="max-w-[1350px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full text-sm">
            <span className="font-semibold">Launch Offer</span>
            <span className="opacity-80">Save 20% on first ride</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Affordable intercity travel — trusted drivers, transparent fares.
          </h1>

          <p className="text-blue-100 max-w-xl">
            Find rides or post your trip in seconds. SisiMove connects travelers across cities with verified drivers and clear pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/join-trip" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow">Join a Trip</Link>
            <Link href="/post-trip" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow">Post a Trip</Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-blue-100 mt-3">
            <div><span className="font-semibold text-white">{drivers.toLocaleString()}</span> drivers online</div>
            <div className="opacity-90">24/7 support</div>
            <div className="opacity-90">Secure payments</div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-gray-900">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Example route</div>
              <div className="text-xs text-gray-500">Preview</div>
            </div>

            <div className="h-52 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">Map preview</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50">
                <div className="text-xs text-gray-600">From</div>
                <div className="font-semibold">Nairobi</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <div className="text-xs text-gray-600">To</div>
                <div className="font-semibold">Kisumu</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-gray-600">Est. 7h</div>
              <div className="font-semibold">KSh 2,800</div>
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-6 left-6">
            <div className="bg-white px-4 py-2 rounded-lg shadow text-sm text-gray-800">Guaranteed pickup or refund</div>
          </div>
        </div>
      </div>
    </section>
  );
}
