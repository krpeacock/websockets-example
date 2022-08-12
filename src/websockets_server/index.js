import { createActor, canisterId } from "../declarations/event_stack/index";
import { WebSocketServer, WebSocket } from "ws";
import { TextEncoder } from "util";

const event_stack = createActor(canisterId, {
  agentOptions: {
    host: "http://127.0.0.1:8000",
  },
});

const server = new WebSocketServer({
  port: 3000,
});
let events = [];
/**
 * @type {WebSocket[]}
 */
let sockets = [];
const encoder = new TextEncoder();
server.on("connection", function (socket) {
  sockets.push(socket);
  console.log("connection opened");
  socket.send(JSON.stringify(events));
});

// Get initial set and then proceed
event_stack.get_current_height().then(async (height) => {
  let initialHeight = height;
  let newEvents = await event_stack.get_events_at_height(height);
  events = newEvents;

  const interval = setInterval(async () => {
    const newEvents = await event_stack.get_events_at_height(
      initialHeight + BigInt(events.length)
    );
    if (newEvents.length) {
      events = [...newEvents, ...events];
      sockets.forEach((s) => {
        console.log(`sending `, JSON.stringify(newEvents));
        s.send(JSON.stringify(newEvents));
      });
    }
  }, 1000);
});
