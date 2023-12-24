import express from "express";
import { createServer } from "node:http";
import { Socket, Server as SocketServer } from "socket.io";
import { InMemoryPlayerRepository } from "./core/infrastructure/repositories/InMemoryPlayerRepository";
import { CreatePlayerAction } from "./core/actions/players/CreatePlayerAction";
import { RemovePlayerAction } from "./core/actions/players/RemovePlayerAction";
import { UpdatePlayersPositionsAction } from "./core/actions/players/UpdatePlayersPositionsAction";
import { MovePlayerAction } from "./core/actions/players/MovePlayerAction";
import { MovePlayerHandler } from "./delivery/sockets/handlers/MovePlayerHandler";
import { RemovePlayerHandler } from "./delivery/sockets/handlers/RemovePlayerHandler";
import { InMemoryWorldMapRepository } from "./core/infrastructure/repositories/InMemoryWorldMapRepository";
import { InMemoryGameService } from "./core/infrastructure/services/InMemoryGameService";
import { PortalCollisionListener } from "./core/listeners/PortalCollisionListener";
import { WorldMapTickListener } from "./core/listeners/WorldMapTickListener";
import { WorldStatusNotifier } from "./delivery/sockets/notifiers/WorldStatusNotifier";
import { PortalCollisionNotifier } from "./delivery/sockets/notifiers/PortalCollisionNotifier";
import { StartGameAction } from "./core/actions/game/StartGameAction";

// creamos los repositorios del juego
const playerRepository = new InMemoryPlayerRepository();
const worldMapRepository = new InMemoryWorldMapRepository();

// creamos el servicio principal del juego
const gameService = new InMemoryGameService(playerRepository, worldMapRepository);

// creamos las acciones del juego
const createPlayerAction = new CreatePlayerAction(playerRepository);
const removePlayerAction = new RemovePlayerAction(playerRepository);
const movePlayerAction = new MovePlayerAction(playerRepository);
const startGameAction = new StartGameAction(gameService);

// creamos los listeners del juego
const portalCollisionListener = new PortalCollisionListener(gameService);
const worldMapTickListener = new WorldMapTickListener(gameService);
gameService.addPortalCollisionListener(portalCollisionListener);
gameService.addWorldMapTickListener(worldMapTickListener);

// creamos los servicios de delivery
const app = express();
const server = createServer(app);
const socketServer = new SocketServer(server, {
  cors: {
    origin: "*"
  }
});

// definimos los mensajes del servidor al cliente y viceversa
const sockets: Record<string, Socket> = {}
socketServer.on("connection", (socket: any) => {
  sockets[socket.id] = socket;
  // TODO: cambiar la dependencia de la accion al game service (o el game service a la altura de las acciones)
  createPlayerAction.execute({ id: socket.id, name: socket.id, worldMapId: "world" });
  socket.join("world");

  new RemovePlayerHandler(sockets, socket, removePlayerAction);
  new MovePlayerHandler(socket, movePlayerAction);
});

const worldStatusNotifier = new WorldStatusNotifier(socketServer);
const portalCollisionNotifier = new PortalCollisionNotifier(sockets);

// agregamos los listeners y corremos le juego
portalCollisionListener.suscribe(portalCollisionNotifier);
worldMapTickListener.suscribe(worldStatusNotifier);
startGameAction.execute();

// algunos metodos de api
app.get("/ping", (req, res) => {
  res.send("Pong!");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
