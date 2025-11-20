"use client";

/**
 * HowItWorks — 3-step flow
 * Reference: /mnt/data/components.docx
 */

export default function HowItWorks() {
  const steps = [
    { title: "Search route", desc: "Enter where you're going and when." },
    { title: "Choose a ride", desc: "Pick a driver, check pickup points, see fare." },
    { title: "Travel & rate", desc: "Complete the trip and rate the driver." },
  ];

  return (
    <section className="py-6">
      <h3 className="text-2xl font-bold mb-6">How it works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="text-xl font-semibold mb-2">{i + 1}. {s.title}</div>
            <p className="text-sm text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
