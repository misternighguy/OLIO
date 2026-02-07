/**
 * Socket.io server for real-time chat.
 * Run: node server/index.js
 * Listens on port 3001 (Next.js uses 3000).
 */
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:3000", "http://127.0.0.1:3000"] },
});

const CHANNEL = "chat";

io.on("connection", (socket) => {
  socket.on("chat:send", (msg) => {
    io.emit("chat:message", msg);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`[Socket.io] Chat server on port ${PORT}`);
});
