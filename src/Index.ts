import express from "express";
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { InMemoryPlayerRepository } from "./core/infrastructure/InMemoryPlayerRepository";
import { CreatePlayerAction } from "./core/actions/players/CreatePlayerAction";
import { RemovePlayerAction } from "./core/actions/players/RemovePlayerAction";
import { UpdatePlayersPositionsAction } from "./core/actions/players/UpdatePlayersPositionsAction";
import { MovePlayerAction } from "./core/actions/players/MovePlayerAction";
import { MovePlayerHandler } from "./delivery/sockets/handlers/MovePlayerHandler";
import { RemovePlayerHandler } from "./delivery/sockets/handlers/RemovePlayerHandler";
import { GAME_LOOP_INTERVAL } from "./core/utils/Constants";
import { GetPlayersAction } from "./core/actions/players/GetPlayersAction";
import { ChangeMapAction } from "./core/actions/players/ChangeMapAction";
import { GetWorldMapAction } from "./core/actions/world/GetWorldMapAction";
import { InMemoryWorldMapRepository } from "./core/infrastructure/InMemoryWorldMapRepository";
import { GetPlayersByWorldMapAction } from "./core/actions/players/GetPlayersByWorldMap";
import { GetWorldStatusAction } from "./core/actions/world/GetWorldStatusAction";
import { GetWorldMapsAction } from "./core/actions/world/GetWorldMapsAction";

// creamos los repositorios del juego
const playerRepository = new InMemoryPlayerRepository();
const worldMapRepository = new InMemoryWorldMapRepository();

// cargamos los maps
worldMapRepository.addMap({
  id: "world",
  name: "world",
  portals: [
    {
      id: "world_portal_1",
      worldMapId: "world",
      position: { x: 300, y: 300 },
      targetWorldMapId: "outworld",
      targetPosition: { x: 0, y: 0 }
    },
  ]
})
worldMapRepository.addMap({
  id: "outworld",
  name: "outworld",
  portals: [
    {
      id: "outworld_portal_1",
      worldMapId: "outworld",
      position: { x: 300, y: 300 },
      targetWorldMapId: "world",
      targetPosition: { x: 0, y: 0 }
    },
  ]
})

// creamos las acciones del juego
const createPlayerAction = new CreatePlayerAction(playerRepository);
const removePlayerAction = new RemovePlayerAction(playerRepository);
const movePlayerAction = new MovePlayerAction(playerRepository);
const getPlayersAction = new GetPlayersAction(playerRepository);
const getPlayersByWorldMapAction = new GetPlayersByWorldMapAction(playerRepository);
const updatePlayersPositionsAction = new UpdatePlayersPositionsAction(playerRepository);
const changeMapAction = new ChangeMapAction(playerRepository);
const getWorldMapAction = new GetWorldMapAction(worldMapRepository)
const getWorldMapsAction = new GetWorldMapsAction(worldMapRepository)
const getWorldStatusAction = new GetWorldStatusAction(worldMapRepository, playerRepository);

// creamos los servicios de delivery
const app = express();
const server = createServer(app);
const socketServer = new SocketServer(server, {
  cors: {
    origin: "*"
  }
});

// definimos los mensajes del servidor al cliente y viceversa
socketServer.on("connection", (socket: any) => {
  createPlayerAction.execute({ id: socket.id, name: socket.id, worldMapId: "world" });
  // socket.emit("world:state", getWorldStatusAction.execute("world")); // lo podemos boletear?

  new RemovePlayerHandler(socket, removePlayerAction);
  new MovePlayerHandler(socket, movePlayerAction);
});

// creamos el game loop de cada mapa
const worldMaps = getWorldMapsAction.execute();
worldMaps.forEach(worldMap => {
  const gameLoopInterval = setInterval(() => {
    updatePlayersPositionsAction.execute(worldMap.id);
    socketServer.emit("world:state", getWorldStatusAction.execute(worldMap.id));
  }, GAME_LOOP_INTERVAL);
});

app.get("/ping", (req, res) => {
  res.send("Pong!");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
