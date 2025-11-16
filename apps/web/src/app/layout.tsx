// apps/web/src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "SisiMove — Africa’s Best Ridesharing App",
  description: "Fast, safe and affordable rides across Africa.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-icon.png",
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

        {/* iOS PWA support */}
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
              {/* Header */}
              <Navbar />

              {/* Page content */}
              <main className="flex-1 pb-16">{children}</main>

              {/* Bottom mobile nav */}
              <BottomNav />
            </div>

            {/* Register Service Worker */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ("serviceWorker" in navigator) {
                    window.addEventListener("load", () => {
                      navigator.serviceWorker
                        .register("/sw.js")
                        .catch(err =>
                          console.log("Service worker registration failed:", err)
                        );
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
