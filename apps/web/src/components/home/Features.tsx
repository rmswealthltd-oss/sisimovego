"use client";

/**
 * Features — three-column feature list
 * Reference: /mnt/data/components.docx
 */

export default function Features() {
  const features = [
    { title: "Verified drivers", text: "Thorough vetting and ratings for peace of mind." },
    { title: "Transparent pricing", text: "Know the fare before you book — no surprises." },
    { title: "Flexible seats", text: "Find rides with seats for everyone. Post your own trip too." },
  ];

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="card">
            <div className="text-lg font-semibold mb-2">{f.title}</div>
            <p className="text-sm text-gray-600">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
