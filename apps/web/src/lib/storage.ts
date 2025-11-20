// apps/web/src/lib/storage.ts

export const storage = {
  set(key: string, value: unknown) {
    try {
      // For primitive strings (like tokens), store as raw string
      if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.error("storage.set error:", err);
    }
  },

  get<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      // Try to detect JSON vs raw string
      if (raw.startsWith("{") || raw.startsWith("[") || raw === "null") {
        return JSON.parse(raw) as T;
      }

      // Return raw string if T is string
      return raw as unknown as T;
    } catch (err) {
      console.error("storage.get error:", err);
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("storage.remove error:", err);
    }
  },
};
