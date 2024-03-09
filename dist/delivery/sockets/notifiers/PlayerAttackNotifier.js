"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAttackNotifier = void 0;
var PLAYER_ATTACK_MESSAGE = "player:attack";
var PlayerAttackNotifier = /** @class */ (function () {
    function PlayerAttackNotifier(sockets) {
        this.sockets = sockets;
    }
    PlayerAttackNotifier.prototype.notify = function (playerId) {
        var playerSocket = this.sockets[playerId];
        playerSocket
            .broadcast
            .emit(PLAYER_ATTACK_MESSAGE, playerId);
        playerSocket
            .emit(PLAYER_ATTACK_MESSAGE, playerId);
    };
    return PlayerAttackNotifier;
}());
exports.PlayerAttackNotifier = PlayerAttackNotifier;
