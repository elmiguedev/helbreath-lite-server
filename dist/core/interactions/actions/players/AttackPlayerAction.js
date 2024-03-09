"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackPlayerAction = void 0;
var AttackPlayerAction = /** @class */ (function () {
    function AttackPlayerAction(playerService) {
        this.playerService = playerService;
    }
    AttackPlayerAction.prototype.execute = function (params) {
        // TODO: this.gameService.attack(params.playerId, params.PlayerId);
    };
    return AttackPlayerAction;
}());
exports.AttackPlayerAction = AttackPlayerAction;
