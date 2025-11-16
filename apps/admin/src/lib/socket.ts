import { io, Socket } from "socket.io-client";
import { getToken } from "./auth";

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;

  const token = getToken();

  // Supports both runtime env (window.__env) + Vite env
  const URL =
    (window as any).__env?.API_WS ||
    import.meta.env.VITE_SOCKET_URL ||
    "http://localhost:3001";

  socket = io(URL, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
  });

  return socket;
}

export function getSocket(): Socket {
  if (!socket) return initSocket();
  return socket;
}
