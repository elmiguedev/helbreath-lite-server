import express from "express";
import { createServer } from "node:http";
import { Socket, Server as SocketServer } from "socket.io";
import { InMemoryPlayerRepository } from "./core/infrastructure/repositories/InMemoryPlayerRepository";
import { CreatePlayerAction } from "./core/interactions/actions/players/CreatePlayerAction";
import { RemovePlayerAction } from "./core/interactions/actions/players/RemovePlayerAction";
import { MovePlayerAction } from "./core/interactions/actions/players/MovePlayerAction";
import { MovePlayerHandler } from "./delivery/sockets/handlers/MovePlayerHandler";
import { RemovePlayerHandler } from "./delivery/sockets/handlers/RemovePlayerHandler";
import { InMemoryWorldMapRepository } from "./core/infrastructure/repositories/InMemoryWorldMapRepository";
import { InMemoryGameService } from "./core/infrastructure/services/InMemoryGameService";
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

// creamos los repositorios del juego
const playerRepository = new InMemoryPlayerRepository();
const worldMapRepository = new InMemoryWorldMapRepository();

// creamos el servicio principal del juego
const gameService = new InMemoryGameService(playerRepository, worldMapRepository);

// creamos las acciones del juego
const createPlayerAction = new CreatePlayerAction(gameService);
const removePlayerAction = new RemovePlayerAction(gameService);
const movePlayerAction = new MovePlayerAction(gameService);
const startGameAction = new StartGameAction(gameService);
const playerAttackMonsterAction = new AttackMonsterAction(gameService)

// creamos los listeners del juego
const worldStatusListener = new WorldStatusListener(gameService);
const playerAttackListener = new PlayerAttackListener(gameService);
const playerChangeMapListener = new PlayerChangeMapListener(gameService);
const monsterKilledListener = new MonsterKilledListener(gameService);

gameService.addPlayerAttackListener(playerAttackListener);
gameService.addWorldStatusListener(worldStatusListener);
gameService.addPlayerChangeMapListener(playerChangeMapListener);
gameService.addMonsterKilledListener(monsterKilledListener);

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
});

const worldStatusNotifier = new WorldStatusNotifier(socketServer);
const playerAttackNotifier = new PlayerAttackNotifier(sockets);
const playerChangeMapNotifier = new PlayerChangeMapNotifier(sockets);
const monsterKilledNotifier = new MonsterKilledNotifier(socketServer);

// agregamos los listeners y corremos le juego
worldStatusListener.suscribe(worldStatusNotifier);
playerAttackListener.suscribe(playerAttackNotifier);
playerChangeMapListener.suscribe(playerChangeMapNotifier);
monsterKilledListener.suscribe(monsterKilledNotifier);

startGameAction.execute();

// algunos metodos de api
app.get("/ping", (req, res) => {
  res.send("Pong!");
})

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
