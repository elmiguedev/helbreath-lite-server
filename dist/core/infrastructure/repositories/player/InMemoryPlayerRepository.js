"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlayerRepository = void 0;
var InMemoryPlayerRepository = /** @class */ (function () {
    function InMemoryPlayerRepository() {
        this.map = new Map();
        this.map = new Map();
    }
    InMemoryPlayerRepository.prototype.add = function (player) {
        this.map.set(player.id, player);
    };
    InMemoryPlayerRepository.prototype.remove = function (id) {
        this.map.delete(id);
    };
    InMemoryPlayerRepository.prototype.getById = function (id) {
        return this.map.get(id);
    };
    InMemoryPlayerRepository.prototype.getAll = function () {
        return Array.from(this.map.values());
    };
    InMemoryPlayerRepository.prototype.update = function (player) {
        this.map.set(player.id, player);
    };
    InMemoryPlayerRepository.prototype.getByWorldMap = function (worldMapId) {
        return this.getAll().filter(function (player) { return player.worldMapId === worldMapId; });
    };
    return InMemoryPlayerRepository;
}());
exports.InMemoryPlayerRepository = InMemoryPlayerRepository;
