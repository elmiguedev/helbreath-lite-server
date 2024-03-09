"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePlayerAction = void 0;
var RemovePlayerAction = /** @class */ (function () {
    function RemovePlayerAction(playerService) {
        this.playerService = playerService;
    }
    RemovePlayerAction.prototype.execute = function (params) {
        this.playerService.removePlayer(params.id);
    };
    return RemovePlayerAction;
}());
exports.RemovePlayerAction = RemovePlayerAction;
