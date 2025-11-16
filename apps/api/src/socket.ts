// src/socket.ts
import { Server } from "socket.io";
import http from "http";
import { verifyJwt } from "./lib/jwt";
import { env } from "./env";

let io: Server | null = null;

export function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error("unauthorized"));
    }

    const decoded: any = verifyJwt(token as string);
    if (!decoded) return next(new Error("invalid_token"));

    socket.data.user = {
      id: decoded.sub,
      role: decoded.role
    };

    // Room binding (so server can emit to user)
    socket.join(`user_${decoded.sub}`);

    next();
  });

  io.on("connection", (socket) => {
    const u = socket.data.user;

    console.log("Socket connected:", u.id, u.role);

    socket.on("joinTrip", (tripId: string) => {
      socket.join(`trip_${tripId}`);
    });

    socket.on("leaveTrip", (tripId: string) => {
      socket.leave(`trip_${tripId}`);
    });

    socket.on("joinDriver", (driverId: string) => {
      socket.join(`driver_${driverId}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
