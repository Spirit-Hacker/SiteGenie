import { prismaClient } from "db/client";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = http.createServer();
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Broadcast function
function broadcast(data: any) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

export async function onFileUpdate(
  filePath: string,
  fileContent: string,
  projectId: string
) {
  console.log("updating file: ", filePath);
  // Broadcast update to all clients
  broadcast({
    type: "file-update",
    fullPath: filePath,
    fileContent,
  });

  await prismaClient.action.create({
    data: {
      projectId,
      content: `Updated File ${filePath}`,
    },
  });
}

export async function onShellCommand(shellCommand: string, projectId: string) {
  // npx --yes vite@latest chess-app && cd chess-app && npm install && npm run dev
  // Broadcast update to all clients
  broadcast({
    type: "terminal-update",
    shellCommand,
  });

  await prismaClient.action.create({
    data: {
      projectId,
      content: `Run command ${shellCommand.trim()}`,
    },
  });
}

server.listen(8082, "0.0.0.0", () => {
  console.log("WebSocket server running 1");
});
