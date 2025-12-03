//apps/api/src
import http from "http";
import { createApp } from "./app";
import { initSockets, getIO } from "./socket";
import { env } from "./env";
import prisma from "./db";
import { getRedis } from "./redis";

async function main() {
  console.log("🚀 Starting API...");

  const app = createApp();
  const server = http.createServer(app);

  // SOCKET.IO
  initSockets(server);

  server.listen(env.PORT, () => {
    console.log(`✅ API running at http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    console.log("\n🔻 Graceful shutdown initiated...");
    await new Promise<void>((resolve) => server.close(() => resolve()));

    try {
      const io = getIO();
      await io.close();
      console.log("📡 Socket.IO closed.");
    } catch {}

    const redis = getRedis();
    if (redis) await redis.quit();

    try {
      await prisma.$disconnect();
    } catch {}

    console.log("👋 Shutdown complete.");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
