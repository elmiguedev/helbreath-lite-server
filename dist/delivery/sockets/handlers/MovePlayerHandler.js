"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovePlayerHandler = exports.MOVE_PLAYER_MESSAGE = void 0;
exports.MOVE_PLAYER_MESSAGE = "player:move";
var MovePlayerHandler = /** @class */ (function () {
    function MovePlayerHandler(socket, action) {
        this.socket = socket;
        socket.on(exports.MOVE_PLAYER_MESSAGE, function (params) {
            action.execute({
                id: socket.id,
                position: {
                    x: params.x,
                    y: params.y
                }
            });
        });
    }
    return MovePlayerHandler;
}());
exports.MovePlayerHandler = MovePlayerHandler;
