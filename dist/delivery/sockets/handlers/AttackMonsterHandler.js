"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackMonsterHandler = exports.PLAYER_ATTACK_MONSTER_MESSAGE = void 0;
exports.PLAYER_ATTACK_MONSTER_MESSAGE = "player:attack:monster";
var AttackMonsterHandler = /** @class */ (function () {
    function AttackMonsterHandler(socket, action) {
        this.socket = socket;
        socket.on(exports.PLAYER_ATTACK_MONSTER_MESSAGE, function (monsterId) {
            action.execute({
                playerId: socket.id,
                targetId: monsterId
            });
        });
    }
    return AttackMonsterHandler;
}());
exports.AttackMonsterHandler = AttackMonsterHandler;
