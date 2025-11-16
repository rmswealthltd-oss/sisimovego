export const storage = {
  set(key: string, value: any) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  get(key: string) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null } },
  remove(key: string) { try { localStorage.removeItem(key); } catch {} }
};
