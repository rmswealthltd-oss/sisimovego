// apps/web/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://sisimove.com"),

  title: {
    default: "SisiMove — Africa’s Best Ridesharing App",
    template: "%s — SisiMove",
  },

  description: "Fast, safe and affordable rides across Africa.",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "SisiMove — Africa’s Best Ridesharing App",
    description: "Fast, safe and affordable rides across Africa.",
    url: "https://sisimove.com",
    siteName: "SisiMove",
    type: "website",
    images: [
      {
        url: "/opengraph-image", // auto-generated OG card
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* PWA icons */}
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* PWA theme */}
        <meta name="theme-color" content="#2563eb" />

        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="SisiMove" />
      </head>

      <body className="bg-white text-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pb-16">{children}</main>
              <BottomNav />
            </div>

            {/* Service Worker */}
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
