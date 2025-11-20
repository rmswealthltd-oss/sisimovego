/**
 * HOMEPAGE — FIXED, NON-OVERLAPPING, PRODUCTION READY
 */

import HeroBanner from "@/components/home/HeroBanner";
import HeroSearch from "@/components/home/HeroSearch";
import Stats from "@/components/home/Stats";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Benefits from "@/components/home/Benefits";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata = {
  title: "SisiMove — Affordable Ride Sharing Across Africa",
  description:
    "Join trips, post trips, and travel affordably with verified drivers. SisiMove connects cities, people, and safe journeys.",
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-24 pb-32">

      {/* HERO SECTION */}
      <section>
        <HeroBanner />
      </section>

      {/* FLOATING SEARCH CARD */}
      <section className="relative -mt-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <HeroSearch />
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Stats />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Features />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Testimonials />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <HowItWorks />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Benefits />
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <CtaBanner />
        </div>
      </section>
    </div>
  );
}
