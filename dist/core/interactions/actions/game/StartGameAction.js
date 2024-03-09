"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartGameAction = void 0;
var Constants_1 = require("../../../utils/Constants");
var MathUtils_1 = require("../../../utils/MathUtils");
var StartGameAction = /** @class */ (function () {
    function StartGameAction(playerService, monsterService, worldMapService) {
        this.playerService = playerService;
        this.monsterService = monsterService;
        this.worldMapService = worldMapService;
        this.gameLoopTimers = {};
    }
    StartGameAction.prototype.execute = function () {
        var _this = this;
        this.createDummyPit("testMap");
        this.worldMapService.getAll().forEach(function (worldMap) {
            _this.gameLoopTimers[worldMap.id] = setInterval(function () {
                _this.playerService.updatePlayersPosition(worldMap);
                _this.worldMapService.notifyWorldStatus(worldMap);
            }, Constants_1.GAME_LOOP_INTERVAL);
        });
    };
    // TODO: esto deberia ir o bien en el mosnter service o bien en el world map service
    StartGameAction.prototype.createDummyPit = function (worldMapId) {
        var _this = this;
        setInterval(function () {
            if (_this.monsterService.getMonstersByWorldMap(worldMapId).length <= 6) {
                var monster = {
                    id: MathUtils_1.MathUtils.getRandomId(),
                    type: "dummy",
                    name: "dummy",
                    position: {
                        x: MathUtils_1.MathUtils.getRandomBetween(600, 700),
                        y: MathUtils_1.MathUtils.getRandomBetween(1000, 1100)
                    },
                    size: {
                        width: 16,
                        height: 16
                    },
                    worldMapId: worldMapId,
                    stats: {
                        maxHealth: 60, // TODO: en realidad tiene una tirada el dummy de 10d8, pero despues lo veremos
                        health: 60,
                        maxMana: 0,
                        mana: 0,
                        damage: 0,
                        defenseRatio: 80,
                        hitRatio: 30,
                        physicalAbsortion: 0,
                        minExperience: 162,
                        maxExperience: 292
                    }
                };
                _this.monsterService.addMonster(monster);
            }
        }, 10000);
    };
    return StartGameAction;
}());
exports.StartGameAction = StartGameAction;
