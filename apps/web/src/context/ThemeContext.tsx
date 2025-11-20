"use client";
import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/lib/storage";

interface ThemeContextType {
  theme: "light" | "dark";
  toggle: () => void;
  setTheme: (t: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start ALWAYS with light → SSR consistency
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Now fix hydration: load stored theme AFTER client mounts
  useEffect(() => {
    const stored = storage.get("theme") as "light" | "dark" | null;

    if (stored && stored !== theme) {
      setThemeState(stored);
    }

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(stored || "light");
  }, []);

  // When theme changes (user toggles)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
    storage.set("theme", theme);
  }, [theme]);

  function setTheme(t: "light" | "dark") {
    setThemeState(t);
  }

  function toggle() {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
