/**
 * Socket.io client for chat.
 * Connects to server at NEXT_PUBLIC_SOCKET_URL or ws://localhost:3001 in dev.
 */
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function createSocket() {
  return io(SOCKET_URL, { autoConnect: true });
}
