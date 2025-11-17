import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// Load Google Font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ========================================================
//                 METADATA (SEO + PWA)
// ========================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://sisimove.com"),

  title: {
    default: "SisiMove — Africa’s Best Ridesharing App",
    template: "%s — SisiMove",
  },

  description: "Fast, safe and affordable rides across Africa.",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: ["/icons/icon-192.png"],
    apple: ["/icons/icon-192.png"],
  },

  themeColor: "#2563eb",

  openGraph: {
    title: "SisiMove — Africa’s Best Ridesharing App",
    description: "Fast, safe and affordable rides across Africa.",
    url: "https://sisimove.com",
    siteName: "SisiMove",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SisiMove OpenGraph Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SisiMove — Africa’s Best Ridesharing App",
    description: "Fast, safe and affordable rides across Africa.",
    images: ["/opengraph-image"],
  },
};

// ========================================================
//                         LAYOUT
// ========================================================
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* Modern PWA tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>

      <body
        className={`${inter.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pb-16">{children}</main>
              <BottomNav />
            </div>

            {/* Service Worker registration */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ("serviceWorker" in navigator) {
                    window.addEventListener("load", () => {
                      navigator.serviceWorker
                        .register("/sw.js")
                        .catch(err => console.log("SW registration failed:", err));
                    });
                  }
                `,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
