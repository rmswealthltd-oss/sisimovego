import { useEffect, useState, useRef } from "react";
import { initSocket, getSocket } from "../lib/socket";

/**
 * useSocket
 * Returns the socket instance once connected and a helper to subscribe to events.
 */
export function useSocket() {
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const s = initSocket();
    socketRef.current = s;

    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      try {
        s.disconnect();
      } catch {}
    };
  }, []);

  function on(event: string, cb: (...args: any[]) => void) {
    const s = getSocket();
    if (!s) return () => {};
    s.on(event, cb);
    return () => s.off(event, cb);
  }

  function emit(event: string, payload?: any) {
    const s = getSocket();
    if (!s) return;
    s.emit(event, payload);
  }

  return {
    connected,
    on,
    emit,
    socket: socketRef.current
  };
}
