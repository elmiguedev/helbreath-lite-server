"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryWorldMapService = void 0;
var InMemoryWorldMapService = /** @class */ (function () {
    function InMemoryWorldMapService(worldMapRepository, playerRepository, monsterRepository) {
        this.worldMapRepository = worldMapRepository;
        this.playerRepository = playerRepository;
        this.monsterRepository = monsterRepository;
        this.worldStatusListeners = [];
    }
    InMemoryWorldMapService.prototype.getAll = function () {
        return this.worldMapRepository.getAll();
    };
    InMemoryWorldMapService.prototype.addWorldStatusListener = function (listener) {
        this.worldStatusListeners.push(listener);
    };
    InMemoryWorldMapService.prototype.notifyWorldStatus = function (worldMap) {
        var _this = this;
        this.worldStatusListeners.forEach(function (listener) {
            var worldStatus = {
                world: {
                    id: worldMap.id,
                    name: worldMap.name
                },
                players: _this.playerRepository.getAll(),
                monsters: _this.monsterRepository.getAll()
            };
            listener.notify(worldStatus);
        });
    };
    return InMemoryWorldMapService;
}());
exports.InMemoryWorldMapService = InMemoryWorldMapService;
