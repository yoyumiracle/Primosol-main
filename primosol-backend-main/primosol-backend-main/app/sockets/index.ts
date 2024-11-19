import WebSocket from "ws";
import router from "./routes";

/**
 * Web Socket API
 * @param {WebSocket.Server} wss
 */
export default function (wss: WebSocket.Server) {
  // socket connection
  wss.on("connection", (socket) => {
    // socket error
    socket.on("error", (err) => {
      console.error("Web Socket error:", err, wss);
    });

    // socket close
    socket.on("close", () => {
      // no action for now
      // console.error("Web Socket close:", wss);
    });

    // socket message
    socket.on("message", function (message: string) {
      try {
        try {
          var [type, payload] = JSON.parse(message);
        } catch (err) {
          throw new Error("Invalid message format");
        }
        router.handle(type, payload, socket, wss);
      } catch (err: any) {
        socket.send(JSON.stringify(["error", err.message]));
      }
    });

    socket.send("Hello from Festify Web Sockets API");
  });
};
