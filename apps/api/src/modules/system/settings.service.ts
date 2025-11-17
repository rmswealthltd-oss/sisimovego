import prisma from "../../db";

let cache: Record<string, string> | null = null;
let cacheLoadedAt: number | null = null;

const CACHE_TTL_MS = 30_000; // 30s – safe for admin panel

export const SettingsService = {
  async loadSettings(forceReload = false) {
    const now = Date.now();

    if (!forceReload && cache && cacheLoadedAt && now - cacheLoadedAt < CACHE_TTL_MS) {
      return cache;
    }

    const rows = await prisma.setting.findMany();
    cache = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    cacheLoadedAt = now;
    return cache;
  },

  async get(key: string) {
    const settings = await this.loadSettings();
    return settings[key] ?? null;
  },

  async set(key: string, value: string) {
    const updated = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // bust cache
    cache = null;
    return updated;
  },

  async reload() {
    cache = null;
    return this.loadSettings(true);
  },
};
