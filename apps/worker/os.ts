import { prismaClient } from "db/client";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = http.createServer();
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set<WebSocket>();

const testContent = `
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
  This file was updated by Pranil
`;

wss.on("connection", async (ws: WebSocket) => {
  console.log("Client connected");
  clients.add(ws);

  // await onFileUpdate(
  //   "app/(tabs)/pranil.tsx",
  //   testContent,
  //   "12345"
  // );

  // await onFileUpdate(
  //   "app/(tabs)/kavya.tsx",
  //   testContent,
  //   "12345"
  // );

  // await onFileUpdate(
  //   "app/(tabs)/dad/sunil.tsx",
  //   testContent,
  //   "12345"
  // );

  // const command = "pwd && ls";
  // onShellCommand(command, "12345");

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
  projectId: string,
  promptId: string
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
      promptId,
    },
  });
}

export async function onShellCommand(
  shellCommand: string,
  projectId: string,
  promptId: string
) {
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
      promptId,
    },
  });
}

server.listen(8082, "0.0.0.0", () => {
  console.log("WebSocket server running on PORT 8082");
});
