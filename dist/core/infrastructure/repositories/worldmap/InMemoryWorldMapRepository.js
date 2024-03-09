"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryWorldMapRepository = void 0;
var TiledMap_1 = require("../../../utils/TiledMap");
var test_json_1 = __importDefault(require("../../data/maps/test/test.json"));
var house_json_1 = __importDefault(require("../../data/maps/house/house.json"));
var InMemoryWorldMapRepository = /** @class */ (function () {
    function InMemoryWorldMapRepository() {
        this.worldMaps = new Map();
        this.tiledMaps = {
            testMap: new TiledMap_1.TiledMap(test_json_1.default),
            house: new TiledMap_1.TiledMap(house_json_1.default),
        };
        this.createWorldMaps();
    }
    InMemoryWorldMapRepository.prototype.createWorldMaps = function () {
        var _this = this;
        Object.keys(this.tiledMaps).forEach(function (worldMapId) {
            var tiledMap = _this.tiledMaps[worldMapId];
            var map = {
                id: worldMapId,
                name: worldMapId,
                size: {
                    width: tiledMap.getWidthInPixels(),
                    height: tiledMap.getHeightInPixels(),
                },
                solids: [],
                portals: [],
            };
            // obtenemos la capa solida
            var solidLayer = tiledMap.getLayer("control");
            if (solidLayer) {
                var tiles = solidLayer.getExistingTiles();
                tiles.forEach(function (tile) {
                    var solidBlock = {
                        size: {
                            width: tile.width,
                            height: tile.height
                        },
                        position: {
                            x: tile.x,
                            y: tile.y
                        }
                    };
                    map.solids.push(solidBlock);
                });
            }
            // obtenemos la capa de objetos para los portales
            var objectsLayer = tiledMap.getLayer("objects");
            if (objectsLayer === null || objectsLayer === void 0 ? void 0 : objectsLayer.objects) {
                objectsLayer.objects.forEach(function (object) {
                    var _a, _b, _c;
                    if (object.type === "portal") {
                        map.portals.push({
                            worldMapId: worldMapId,
                            position: {
                                x: object.x,
                                y: object.y
                            },
                            size: {
                                width: object.width,
                                height: object.height
                            },
                            target: {
                                worldMapId: (_a = object.properties.find(function (p) { return p.name === "targetWorldMapId"; })) === null || _a === void 0 ? void 0 : _a.value,
                                position: {
                                    x: (_b = object.properties.find(function (p) { return p.name === "targetPositionX"; })) === null || _b === void 0 ? void 0 : _b.value,
                                    y: (_c = object.properties.find(function (p) { return p.name === "targetPositionY"; })) === null || _c === void 0 ? void 0 : _c.value
                                }
                            }
                        });
                    }
                });
            }
            // agregamos el mapa
            _this.worldMaps.set(map.id, map);
        });
    };
    InMemoryWorldMapRepository.prototype.getAll = function () {
        return Array.from(this.worldMaps.values());
    };
    InMemoryWorldMapRepository.prototype.addMap = function (worldMap) {
        this.worldMaps.set(worldMap.id, worldMap);
    };
    InMemoryWorldMapRepository.prototype.getById = function (id) {
        return this.worldMaps.get(id);
    };
    return InMemoryWorldMapRepository;
}());
exports.InMemoryWorldMapRepository = InMemoryWorldMapRepository;
