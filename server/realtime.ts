import { createServer } from "node:http";

import { WebSocket, WebSocketServer } from "ws";

type TripStatusEvent = {
  tripId: string;
  status: "requested" | "matched" | "confirmed" | "completed";
  updatedAt: string;
};

const port = Number(process.env.REALTIME_PORT ?? 8081);
const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ service: "zotpool-realtime", status: "ok" }));
    return;
  }
  response.writeHead(404).end();
});

const sockets = new WebSocketServer({ server });

function broadcast(event: TripStatusEvent): void {
  const payload = JSON.stringify(event);
  for (const client of sockets.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
}

sockets.on("connection", (socket) => {
  socket.send(
    JSON.stringify({
      type: "connected",
      message: "Listening for ZotPool trip status updates",
    }),
  );

  socket.on("message", (rawMessage) => {
    try {
      const event = JSON.parse(rawMessage.toString()) as Partial<TripStatusEvent>;
      if (!event.tripId || !event.status) return;
      broadcast({
        tripId: event.tripId,
        status: event.status,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid event" }));
    }
  });
});

server.listen(port, () => {
  console.log(`ZotPool realtime service listening on port ${port}`);
});
