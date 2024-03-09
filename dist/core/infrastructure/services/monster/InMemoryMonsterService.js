"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMonsterService = void 0;
var MathUtils_1 = require("../../../utils/MathUtils");
var InMemoryMonsterService = /** @class */ (function () {
    function InMemoryMonsterService(monsterRepository) {
        this.monsterRepository = monsterRepository;
        this.monsterKilledListeners = [];
    }
    InMemoryMonsterService.prototype.addMonster = function (monster) {
        if (!this.monsterRepository.getById(monster.id)) {
            this.monsterRepository.add(monster);
        }
    };
    InMemoryMonsterService.prototype.getMonster = function (monsterId) {
        return this.monsterRepository.getById(monsterId);
    };
    InMemoryMonsterService.prototype.removeMonster = function (monsterId) {
        return this.monsterRepository.remove(monsterId);
    };
    InMemoryMonsterService.prototype.killMonster = function (monsterId) {
        var monster = this.monsterRepository.remove(monsterId);
        if (monster) {
            this.monsterKilledListeners.forEach(function (listener) {
                listener.notify(monster);
            });
        }
    };
    InMemoryMonsterService.prototype.addMonsterKilledListener = function (listener) {
        this.monsterKilledListeners.push(listener);
    };
    InMemoryMonsterService.prototype.getMonstersByWorldMap = function (worldMapId) {
        return this.monsterRepository.getByWorldMap(worldMapId);
    };
    InMemoryMonsterService.prototype.getMonsterExperience = function (monster) {
        return MathUtils_1.MathUtils.getIntegerBetween(monster.stats.minExperience, monster.stats.maxExperience);
    };
    return InMemoryMonsterService;
}());
exports.InMemoryMonsterService = InMemoryMonsterService;
