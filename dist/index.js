"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var node_http_1 = require("node:http");
var socket_io_1 = require("socket.io");
var InMemoryPlayerRepository_1 = require("./core/infrastructure/repositories/player/InMemoryPlayerRepository");
var CreatePlayerAction_1 = require("./core/interactions/actions/players/CreatePlayerAction");
var RemovePlayerAction_1 = require("./core/interactions/actions/players/RemovePlayerAction");
var MovePlayerAction_1 = require("./core/interactions/actions/players/MovePlayerAction");
var MovePlayerHandler_1 = require("./delivery/sockets/handlers/MovePlayerHandler");
var RemovePlayerHandler_1 = require("./delivery/sockets/handlers/RemovePlayerHandler");
var InMemoryWorldMapRepository_1 = require("./core/infrastructure/repositories/worldmap/InMemoryWorldMapRepository");
var PlayerChangeMapListener_1 = require("./core/interactions/listeners/PlayerChangeMapListener");
var WorldStatusNotifier_1 = require("./delivery/sockets/notifiers/WorldStatusNotifier");
var PlayerChangeMapNotifier_1 = require("./delivery/sockets/notifiers/PlayerChangeMapNotifier");
var StartGameAction_1 = require("./core/interactions/actions/game/StartGameAction");
var MonsterKilledListener_1 = require("./core/interactions/listeners/MonsterKilledListener");
var MonsterKilledNotifier_1 = require("./delivery/sockets/notifiers/MonsterKilledNotifier");
var PlayerAttackListener_1 = require("./core/interactions/listeners/PlayerAttackListener");
var PlayerAttackNotifier_1 = require("./delivery/sockets/notifiers/PlayerAttackNotifier");
var WorldStatusListener_1 = require("./core/interactions/listeners/WorldStatusListener");
var AttackMonsterAction_1 = require("./core/interactions/actions/players/AttackMonsterAction");
var AttackMonsterHandler_1 = require("./delivery/sockets/handlers/AttackMonsterHandler");
var InMemoryPlayerService_1 = require("./core/infrastructure/services/player/InMemoryPlayerService");
var InMemoryMonsterRepository_1 = require("./core/infrastructure/repositories/monster/InMemoryMonsterRepository");
var InMemoryMonsterService_1 = require("./core/infrastructure/services/monster/InMemoryMonsterService");
var InMemoryWorldMapService_1 = require("./core/infrastructure/services/worldmap/InMemoryWorldMapService");
// creamos los repositorios del juego
var playerRepository = new InMemoryPlayerRepository_1.InMemoryPlayerRepository();
var monsterRepository = new InMemoryMonsterRepository_1.InMemoryMonsterRepository();
var worldMapRepository = new InMemoryWorldMapRepository_1.InMemoryWorldMapRepository();
// creamos el servicio principal del juego
var playerService = new InMemoryPlayerService_1.InMemoryPlayerService(playerRepository, monsterRepository, worldMapRepository);
var monsterService = new InMemoryMonsterService_1.InMemoryMonsterService(monsterRepository);
var worldMapService = new InMemoryWorldMapService_1.InMemoryWorldMapService(worldMapRepository, playerRepository, monsterRepository);
// creamos las acciones del juego
var createPlayerAction = new CreatePlayerAction_1.CreatePlayerAction(playerService);
var removePlayerAction = new RemovePlayerAction_1.RemovePlayerAction(playerService);
var movePlayerAction = new MovePlayerAction_1.MovePlayerAction(playerService);
var playerAttackMonsterAction = new AttackMonsterAction_1.AttackMonsterAction(playerService, monsterService);
var startGameAction = new StartGameAction_1.StartGameAction(playerService, monsterService, worldMapService);
// creamos los listeners del juego
var worldStatusListener = new WorldStatusListener_1.WorldStatusListener(worldMapService);
var playerAttackListener = new PlayerAttackListener_1.PlayerAttackListener(playerService);
var playerChangeMapListener = new PlayerChangeMapListener_1.PlayerChangeMapListener(playerService);
var monsterKilledListener = new MonsterKilledListener_1.MonsterKilledListener(monsterService);
worldMapService.addWorldStatusListener(worldStatusListener);
playerService.addPlayerChangeMapListener(playerChangeMapListener);
playerService.addPlayerAttackListener(playerAttackListener);
monsterService.addMonsterKilledListener(monsterKilledListener);
// creamos los servicios de delivery
var app = (0, express_1.default)();
var server = (0, node_http_1.createServer)(app);
var socketServer = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
// definimos los mensajes del servidor al cliente y viceversa
var sockets = {};
socketServer.on("connection", function (socket) {
    console.log("connected", socket.id);
    sockets[socket.id] = socket;
    // TODO: cambiar la dependencia de la accion al game service (o el game service a la altura de las acciones)
    createPlayerAction.execute({ id: socket.id, name: socket.id, worldMapId: "testMap" });
    socket.join("testMap");
    new RemovePlayerHandler_1.RemovePlayerHandler(sockets, socket, removePlayerAction);
    new MovePlayerHandler_1.MovePlayerHandler(socket, movePlayerAction);
    new AttackMonsterHandler_1.AttackMonsterHandler(socket, playerAttackMonsterAction);
});
var worldStatusNotifier = new WorldStatusNotifier_1.WorldStatusNotifier(socketServer);
var playerAttackNotifier = new PlayerAttackNotifier_1.PlayerAttackNotifier(sockets);
var playerChangeMapNotifier = new PlayerChangeMapNotifier_1.PlayerChangeMapNotifier(sockets);
var monsterKilledNotifier = new MonsterKilledNotifier_1.MonsterKilledNotifier(socketServer);
// agregamos los listeners y corremos le juego
worldStatusListener.suscribe(worldStatusNotifier);
playerAttackListener.suscribe(playerAttackNotifier);
playerChangeMapListener.suscribe(playerChangeMapNotifier);
monsterKilledListener.suscribe(monsterKilledNotifier);
startGameAction.execute();
// algunos metodos de api
app.get("/ping", function (req, res) {
    res.send("Pong!");
});
server.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
