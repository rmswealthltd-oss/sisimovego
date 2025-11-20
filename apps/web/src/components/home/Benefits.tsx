"use client";

/**
 * Benefits — short reasons to choose SisiMove
 * Reference: /mnt/data/components.docx
 */

export default function Benefits() {
  const items = [
    "Local-first pricing & routes",
    "Driver identity verification",
    "24/7 support & dispute resolution",
    "Simple booking & in-app chat",
  ];

  return (
    <section className="py-6">
      <h3 className="text-2xl font-bold mb-4">Why choose SisiMove?</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((it, i) => (
          <li key={i} className="bg-white p-4 rounded-xl border text-gray-700">{it}</li>
        ))}
      </ul>
    </section>
  );
}
