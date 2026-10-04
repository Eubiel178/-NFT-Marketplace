import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { z } from "zod";
import { env } from "@/lib/env";
import type { NftUpdated, OrderUpdated } from "@/contracts";

// MSW normalizes the Socket.IO transport path to its namespace ('/').
const url = new URL("/", env.socketUrl);
url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
const channel = ws.link(url.toString());
const clients = new Set<ReturnType<typeof toSocketIo>>();
const orderSubscriptionSchema = z.object({ userId: z.string(), orderId: z.string() });
const orderSubscriptions = new Map<ReturnType<typeof toSocketIo>, z.infer<typeof orderSubscriptionSchema>>();
export const socketHandlers = [
  channel.addEventListener("connection", (connection) => {
    const client = toSocketIo(connection);
    clients.add(client);
    client.client.on("order.subscribe", (_event, payload: unknown) => {
      const subscription = orderSubscriptionSchema.safeParse(payload);
      if (subscription.success) orderSubscriptions.set(client, subscription.data);
    });
    // Version 0.2 negotiates the handshake, but does not implement heartbeat.
    const heartbeat = setInterval(() => connection.client.send("2"), 20_000);
    connection.client.addEventListener("close", () => {
      clearInterval(heartbeat);
      clients.delete(client);
      orderSubscriptions.delete(client);
    });
  }),
];
export function broadcastNft(event: NftUpdated) {
  for (const client of clients) client.client.emit("nft.updated", event);
}
export function broadcastOrder(event: OrderUpdated) {
  for (const [client, subscription] of orderSubscriptions) {
    if (subscription.userId === event.userId && subscription.orderId === event.resourceId) {
      client.client.emit("order.updated", event);
    }
  }
}
export function disconnectSockets() {
  for (const client of clients) client.rawClient.close(1000, "mock disconnect");
}
