"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerChangeMapNotifier = exports.PLAYER_DISCONNECTED_MESSAGE = exports.PLAYER_CHANGE_MAP_MESSAGE = void 0;
exports.PLAYER_CHANGE_MAP_MESSAGE = "player:changemap";
exports.PLAYER_DISCONNECTED_MESSAGE = "player:disconnected";
var PlayerChangeMapNotifier = /** @class */ (function () {
    function PlayerChangeMapNotifier(sockets) {
        this.sockets = sockets;
    }
    PlayerChangeMapNotifier.prototype.notify = function (changes) {
        var _this = this;
        changes.forEach(function (change) {
            var playerSocket = _this.sockets[change.playerId];
            playerSocket.leave(change.fromWorldMapId);
            playerSocket.join(change.toWorldMapId);
            playerSocket.emit(exports.PLAYER_CHANGE_MAP_MESSAGE, change);
            playerSocket.broadcast.emit(exports.PLAYER_DISCONNECTED_MESSAGE, change.playerId);
        });
    };
    return PlayerChangeMapNotifier;
}());
exports.PlayerChangeMapNotifier = PlayerChangeMapNotifier;
