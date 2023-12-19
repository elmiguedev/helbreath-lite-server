import express from "express";
import { createServer } from "node:http";
import { SocketServer } from "./delivery/sockets/SocketServer";

// Creamos los servidores

const app = express();
const server = createServer(app);
const socketServer = new SocketServer(server);


app.get("/ping", (req, res) => {
  res.send("Pong!");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
