"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovePlayerAction = void 0;
var MovePlayerAction = /** @class */ (function () {
    function MovePlayerAction(playerService) {
        this.playerService = playerService;
    }
    MovePlayerAction.prototype.execute = function (params) {
        var id = params.id, position = params.position;
        var player = this.playerService.getPlayer(id);
        if (player) {
            player.target = position;
        }
    };
    return MovePlayerAction;
}());
exports.MovePlayerAction = MovePlayerAction;
