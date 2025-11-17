"use client";

export default function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white py-20 px-6 rounded-xl shadow-lg mb-10">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Move easily. Travel anywhere.
        </h1>

        <p className="text-lg text-blue-100">
          Safe, affordable and reliable rides across Africa — book your next trip in seconds.
        </p>
      </div>
    </section>
  );
}
