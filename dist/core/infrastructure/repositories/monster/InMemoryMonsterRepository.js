"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMonsterRepository = void 0;
var InMemoryMonsterRepository = /** @class */ (function () {
    function InMemoryMonsterRepository() {
        this.map = new Map();
    }
    InMemoryMonsterRepository.prototype.add = function (monster) {
        this.map.set(monster.id, monster);
    };
    InMemoryMonsterRepository.prototype.remove = function (id) {
        var monster = this.map.get(id);
        if (monster) {
            this.map.delete(id);
            return monster;
        }
    };
    InMemoryMonsterRepository.prototype.getById = function (id) {
        return this.map.get(id);
    };
    InMemoryMonsterRepository.prototype.getAll = function () {
        return Array.from(this.map.values());
    };
    InMemoryMonsterRepository.prototype.update = function (monster) {
        this.map.set(monster.id, monster);
    };
    InMemoryMonsterRepository.prototype.getByWorldMap = function (worldMapId) {
        return this.getAll().filter(function (monster) { return monster.worldMapId === worldMapId; });
    };
    return InMemoryMonsterRepository;
}());
exports.InMemoryMonsterRepository = InMemoryMonsterRepository;
