"use client";

/**
 * Testimonials — small cards
 * Reference: /mnt/data/components.docx
 */

export default function Testimonials() {
  const items = [
    { name: "Amina", quote: "Found a cheap trip to Mombasa — driver was great!" },
    { name: "Joseph", quote: "Clear prices and easy booking." },
    { name: "Grace", quote: "I post trips as a driver and fill seats fast." },
  ];

  return (
    <section className="py-6">
      <h3 className="text-2xl font-bold mb-4">What people say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div key={i} className="card">
            <p className="text-gray-700">“{it.quote}”</p>
            <div className="mt-3 font-semibold">{it.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
