"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldStatusListener = void 0;
var WorldStatusListener = /** @class */ (function () {
    function WorldStatusListener(worldMapService) {
        this.worldMapService = worldMapService;
        this.listeners = [];
        this.worldMapService.addWorldStatusListener(this);
    }
    WorldStatusListener.prototype.notify = function (worldMapStatus) {
        this.listeners.forEach(function (listener) {
            listener.notify(worldMapStatus);
        });
    };
    WorldStatusListener.prototype.suscribe = function (listener) {
        this.listeners.push(listener);
    };
    return WorldStatusListener;
}());
exports.WorldStatusListener = WorldStatusListener;
