import express from "express";
import { createServer } from "node:http";
import { Socket, Server as SocketServer } from "socket.io";
import { InMemoryPlayerRepository } from "./core/infrastructure/repositories/player/InMemoryPlayerRepository";
import { CreatePlayerAction } from "./core/interactions/actions/players/CreatePlayerAction";
import { RemovePlayerAction } from "./core/interactions/actions/players/RemovePlayerAction";
import { MovePlayerAction } from "./core/interactions/actions/players/MovePlayerAction";
import { MovePlayerHandler } from "./delivery/sockets/handlers/MovePlayerHandler";
import { RemovePlayerHandler } from "./delivery/sockets/handlers/RemovePlayerHandler";
import { InMemoryWorldMapRepository } from "./core/infrastructure/repositories/worldmap/InMemoryWorldMapRepository";
import { PlayerChangeMapListener } from "./core/interactions/listeners/PlayerChangeMapListener";
import { WorldStatusNotifier } from "./delivery/sockets/notifiers/WorldStatusNotifier";
import { PlayerChangeMapNotifier } from "./delivery/sockets/notifiers/PlayerChangeMapNotifier";
import { StartGameAction } from "./core/interactions/actions/game/StartGameAction";
import { MonsterKilledListener } from "./core/interactions/listeners/MonsterKilledListener";
import { MonsterKilledNotifier } from "./delivery/sockets/notifiers/MonsterKilledNotifier";
import { PlayerAttackListener } from "./core/interactions/listeners/PlayerAttackListener";
import { PlayerAttackNotifier } from "./delivery/sockets/notifiers/PlayerAttackNotifier";
import { WorldStatusListener } from "./core/interactions/listeners/WorldStatusListener";
import { AttackMonsterAction } from "./core/interactions/actions/players/AttackMonsterAction";
import { AttackMonsterHandler } from "./delivery/sockets/handlers/AttackMonsterHandler";
import { InMemoryPlayerService } from "./core/infrastructure/services/player/InMemoryPlayerService";
import { InMemoryMonsterRepository } from "./core/infrastructure/repositories/monster/InMemoryMonsterRepository";
import { InMemoryMonsterService } from "./core/infrastructure/services/monster/InMemoryMonsterService";
import { InMemoryWorldMapService } from "./core/infrastructure/services/worldmap/InMemoryWorldMapService";
import { PlayerLevelUpNotifier } from "./delivery/sockets/notifiers/PlayerLevelUpNotifier";
import { PlayerLevelUpListener } from "./core/interactions/listeners/PlayerLevelUpListener";
import { PlayerAttributesAction } from "./core/interactions/actions/players/PlayerAttributesAction";
import { PlayerAttributesHandler } from "./delivery/sockets/handlers/PlayerAttributesHandler";

// creamos los repositorios del juego
const playerRepository = new InMemoryPlayerRepository();
const monsterRepository = new InMemoryMonsterRepository();
const worldMapRepository = new InMemoryWorldMapRepository();

// creamos el servicio principal del juego
const playerService = new InMemoryPlayerService(playerRepository, monsterRepository, worldMapRepository);
const monsterService = new InMemoryMonsterService(monsterRepository);
const worldMapService = new InMemoryWorldMapService(worldMapRepository, playerRepository, monsterRepository);

// creamos las acciones del juego
const createPlayerAction = new CreatePlayerAction(playerService);
const removePlayerAction = new RemovePlayerAction(playerService);
const movePlayerAction = new MovePlayerAction(playerService);
const playerAttackMonsterAction = new AttackMonsterAction(playerService, monsterService)
const startGameAction = new StartGameAction(playerService, monsterService, worldMapService);
const playerAttributesAction = new PlayerAttributesAction(playerService);

// creamos los listeners del juego
const worldStatusListener = new WorldStatusListener(worldMapService);
const playerAttackListener = new PlayerAttackListener(playerService);
const playerChangeMapListener = new PlayerChangeMapListener(playerService);
const monsterKilledListener = new MonsterKilledListener(monsterService);
const playerLevelUpListener = new PlayerLevelUpListener(playerService);

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
  console.log("connected", socket.id);
  sockets[socket.id] = socket;
  // TODO: cambiar la dependencia de la accion al game service (o el game service a la altura de las acciones)
  createPlayerAction.execute({ id: socket.id, name: socket.id, worldMapId: "testMap" });
  socket.join("testMap");

  new RemovePlayerHandler(sockets, socket, removePlayerAction);
  new MovePlayerHandler(socket, movePlayerAction);
  new AttackMonsterHandler(socket, playerAttackMonsterAction);
  new PlayerAttributesHandler(socket, playerAttributesAction);
});

const worldStatusNotifier = new WorldStatusNotifier(socketServer);
const playerAttackNotifier = new PlayerAttackNotifier(sockets);
const playerChangeMapNotifier = new PlayerChangeMapNotifier(sockets);
const playerLevelUpNotifier = new PlayerLevelUpNotifier(sockets);
const monsterKilledNotifier = new MonsterKilledNotifier(socketServer);

// agregamos los listeners y corremos le juego
worldStatusListener.suscribe(worldStatusNotifier);
playerAttackListener.suscribe(playerAttackNotifier);
playerChangeMapListener.suscribe(playerChangeMapNotifier);
monsterKilledListener.suscribe(monsterKilledNotifier);
playerLevelUpListener.suscribe(playerLevelUpNotifier);

startGameAction.execute();

// algunos metodos de api
app.get("/ping", (req, res) => {
  res.send("Pong!");
})
app.get("/", (req, res) => {
  res.send("Vamo a juga al helbreath :D");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
