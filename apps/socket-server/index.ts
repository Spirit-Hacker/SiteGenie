Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  port: 8082,
  websocket: {
    message(ws, message) {
      console.log(message);
    },
    open(ws) {
      console.log("OPEN");
      setInterval(() => {
        ws.send("Hello from the server!");
      }, 10000);
    },
  },
});
