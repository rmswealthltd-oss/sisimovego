"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  // user theme → dark/light for UI
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  /**
   * Reads stored theme on load
   */
  useEffect(() => {
    const stored = localStorage.getItem("admin-theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  /**
   * Applies & resolves theme whenever `theme` changes
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /**
   * Change theme + persist
   */
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("admin-theme", t);
  };

  /**
   * One-click toggle for user
   */
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else {
      // system → toggle based on current
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "light" : "dark");
    }
  };

  /**
   * The real logic applying classes
   */
  const applyTheme = (value: Theme) => {
    const root = window.document.documentElement;

    let newResolved: "light" | "dark" = "light";

    if (value === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      newResolved = prefersDark ? "dark" : "light";
    } else {
      newResolved = value;
    }

    setResolvedTheme(newResolved);

    if (newResolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        toggleTheme,
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook for consuming the theme
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
