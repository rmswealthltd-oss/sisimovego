import { io, Socket } from "socket.io-client";
import { getToken } from "./auth";

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;
  const base = process.env.NEXT_PUBLIC_API_WS || "http://localhost:3001";
  socket = io(base, { auth: { token: getToken() } });
  return socket;
}
