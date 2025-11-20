"use client";

/**
 * CtaBanner — final CTA before footer
 * Reference: /mnt/data/components.docx
 */

import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">Ready to move smarter?</h3>
          <p className="mt-2 text-blue-100">Join thousands of happy riders & drivers across Africa.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/join-trip" className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold">Join a Trip</Link>
          <Link href="/post-trip" className="bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold">Post a Trip</Link>
        </div>
      </div>
    </section>
  );
}
