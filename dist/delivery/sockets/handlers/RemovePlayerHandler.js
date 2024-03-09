"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePlayerHandler = exports.REMOVE_PLAYER_MESSAGE = void 0;
exports.REMOVE_PLAYER_MESSAGE = "disconnect";
var RemovePlayerHandler = /** @class */ (function () {
    function RemovePlayerHandler(sockets, socket, action) {
        socket.on(exports.REMOVE_PLAYER_MESSAGE, function () {
            action.execute({ id: socket.id });
            socket.broadcast.emit("player:disconnected", socket.id);
            delete sockets[socket.id];
        });
    }
    return RemovePlayerHandler;
}());
exports.RemovePlayerHandler = RemovePlayerHandler;
