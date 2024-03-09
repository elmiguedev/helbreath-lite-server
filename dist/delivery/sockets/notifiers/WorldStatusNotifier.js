"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldStatusNotifier = exports.WORLD_STATUS_MESSAGE = void 0;
exports.WORLD_STATUS_MESSAGE = "world:status";
var WorldStatusNotifier = /** @class */ (function () {
    function WorldStatusNotifier(socketServer) {
        this.socketServer = socketServer;
    }
    WorldStatusNotifier.prototype.notify = function (worldStatus) {
        this.socketServer
            .to(worldStatus.world.id)
            .emit(exports.WORLD_STATUS_MESSAGE, worldStatus);
    };
    return WorldStatusNotifier;
}());
exports.WorldStatusNotifier = WorldStatusNotifier;
