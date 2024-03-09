"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerChangeMapListener = void 0;
var PlayerChangeMapListener = /** @class */ (function () {
    function PlayerChangeMapListener(playerService) {
        this.playerService = playerService;
        this.listeners = [];
        this.playerService.addPlayerChangeMapListener(this);
    }
    PlayerChangeMapListener.prototype.notify = function (changes) {
        this.listeners.forEach(function (listener) {
            listener.notify(changes);
        });
    };
    PlayerChangeMapListener.prototype.suscribe = function (listener) {
        this.listeners.push(listener);
    };
    return PlayerChangeMapListener;
}());
exports.PlayerChangeMapListener = PlayerChangeMapListener;
