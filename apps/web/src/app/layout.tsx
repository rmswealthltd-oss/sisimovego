/**
 * GLOBAL ROOT LAYOUT — SisiMove
 *
 * Stable, hydration-safe, production-ready
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientShell from "./ClientShell";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SisiMove — Move easily. Travel anywhere.",
  description:
    "Africa-first ride-sharing & bus booking platform. Join trips, post trips, and travel safely with verified drivers.",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <ClientShell>
          {/* HEADER (fixed spacing, no hydration mismatch) */}
          <header className="w-full z-50">
            <Header />
          </header>

          {/* MAIN CONTENT */}
          <main className="w-full flex-1">
            <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <footer className="w-full mt-20">
            <Footer />
          </footer>

          {/* BOTTOM NAV (mobile only) */}
          <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[500px] px-4 safe-bottom">
            <BottomNav />
          </div>
        </ClientShell>
      </body>
    </html>
  );
}
