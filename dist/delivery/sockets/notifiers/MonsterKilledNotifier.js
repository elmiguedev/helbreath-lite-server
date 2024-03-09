"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterKilledNotifier = exports.MONSTER_KILLED_MESSAGE = void 0;
exports.MONSTER_KILLED_MESSAGE = "monster:killed";
var MonsterKilledNotifier = /** @class */ (function () {
    function MonsterKilledNotifier(socketServer) {
        this.socketServer = socketServer;
    }
    MonsterKilledNotifier.prototype.notify = function (monster) {
        this.socketServer
            .to(monster.worldMapId)
            .emit(exports.MONSTER_KILLED_MESSAGE, monster);
    };
    return MonsterKilledNotifier;
}());
exports.MonsterKilledNotifier = MonsterKilledNotifier;
