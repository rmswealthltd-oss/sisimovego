import { Server } from "socket.io";
import http from "http";
import { verifyJwt } from "./lib/jwt";
import { env } from "./env";

// Persist io across hot reloads
declare global {
  var _io: Server | undefined;
}

let io: Server | undefined;

export function initSockets(httpServer: http.Server) {
  if (io) return io;
  if (global._io) {
    io = global._io;
    console.log("⚠️ Socket.IO already initialized → reusing existing instance");
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("unauthorized"));

    const payload: any = verifyJwt(token as string);
    if (!payload) return next(new Error("invalid_token"));

    socket.data.user = { id: payload.sub, role: payload.role };
    socket.join(`user_${payload.sub}`);
    next();
  });

  io.on("connection", (socket) => {
    console.log(`🔌 connected → user=${socket.data.user.id}`);

    socket.on("joinTrip", (tripId: string) => socket.join(`trip_${tripId}`));
    socket.on("leaveTrip", (tripId: string) => socket.leave(`trip_${tripId}`));
    socket.on("disconnect", () => console.log(`🔴 disconnected → user=${socket.data.user.id}`));
  });

  global._io = io;

  return io;
}

export function getIO(): Server {
  if (!io) io = global._io;
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
