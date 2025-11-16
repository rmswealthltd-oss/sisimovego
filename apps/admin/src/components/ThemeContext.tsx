import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "sisimove_admin_theme";

export type Theme = "light" | "dark" | "system";

const ThemeContext = createContext({
  theme: "light" as Theme,
  setTheme: (t: Theme) => {},
  toggle: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return (raw as Theme) || "light";
  });

  useEffect(() => {
    apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => setThemeState((s) => (s === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
};

function apply(theme: Theme) {
  const el = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    el.classList.toggle("dark", prefersDark);
  } else {
    el.classList.toggle("dark", theme === "dark");
  }
}
