"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAttackListener = void 0;
var PlayerAttackListener = /** @class */ (function () {
    function PlayerAttackListener(playerService) {
        this.playerService = playerService;
        this.listeners = [];
        this.playerService.addPlayerAttackListener(this);
    }
    PlayerAttackListener.prototype.notify = function (playerId) {
        this.listeners.forEach(function (listener) {
            listener.notify(playerId);
        });
    };
    PlayerAttackListener.prototype.suscribe = function (listener) {
        this.listeners.push(listener);
    };
    return PlayerAttackListener;
}());
exports.PlayerAttackListener = PlayerAttackListener;
