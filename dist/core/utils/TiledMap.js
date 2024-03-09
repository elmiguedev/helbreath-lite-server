"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledMap = exports.TiledMapLayer = void 0;
var TiledMapLayer = /** @class */ (function () {
    function TiledMapLayer(tilemap, props) {
        var _this = this;
        this.tilemap = tilemap;
        this.id = props.id;
        this.data = props.data;
        this.name = props.name;
        this.opacity = props.opacity;
        this.type = props.type;
        this.visible = props.visible;
        this.x = props.x;
        this.y = props.y;
        this.layers = [];
        this.objects = props.objects;
        if (props.layers) {
            props.layers.forEach(function (layer) {
                _this.layers.push(new TiledMapLayer(_this.tilemap, layer));
            });
        }
    }
    TiledMapLayer.prototype.getLayer = function (name) {
        return this.layers.find(function (layer) { return layer.name === name; });
    };
    TiledMapLayer.prototype.getTile = function (id) {
        var tileset = this.tilemap.getTilesets().find(function (tileset) { return tileset.firstgid >= id; });
        if (tileset === null || tileset === void 0 ? void 0 : tileset.tiles) {
            return tileset.tiles.find(function (tile) { return tile.id === id - tileset.firstgid; });
        }
    };
    // TODO: refactor, hacer que sea por id o por prop,
    TiledMapLayer.prototype.getExistingTiles = function () {
        var tileSize = 16;
        var tiles = [];
        for (var i = 0; i < this.data.length; i++) {
            var tileData = this.data[i];
            if (tileData > 0) {
                var tileX = (i % this.tilemap.getWidth()) * tileSize;
                var tileY = Math.floor(i / this.tilemap.getWidth()) * tileSize;
                tiles.push({
                    x: tileX,
                    y: tileY,
                    width: tileSize,
                    height: tileSize
                });
            }
        }
        return tiles;
    };
    TiledMapLayer.prototype.getTileFromPosition = function (x, y) {
        var currentTile = Math.floor(x / this.tilemap.getTileWidth()) + Math.floor(y / this.tilemap.getTileHeight()) * this.tilemap.getWidth();
        var tileId = this.data[currentTile];
        return this.getTile(tileId);
    };
    TiledMapLayer.prototype.getObjectFromPosition = function (x, y) {
        var _a;
        return (_a = this.objects) === null || _a === void 0 ? void 0 : _a.find(function (object) {
            return x >= object.x && x <= object.x + object.width &&
                y >= object.y && y <= object.y + object.height;
        });
    };
    return TiledMapLayer;
}());
exports.TiledMapLayer = TiledMapLayer;
var TiledMap = /** @class */ (function () {
    function TiledMap(src) {
        var _this = this;
        this.layers = [];
        this.src = src;
        if (this.src.layers) {
            this.src.layers.forEach(function (layer) {
                _this.layers.push(new TiledMapLayer(_this, layer));
            });
        }
    }
    TiledMap.prototype.getGroupLayers = function () {
        var _this = this;
        return this.src.layers
            .filter(function (layer) { return layer.type === "group"; })
            .map(function (layer) { return new TiledMapLayer(_this, layer); });
    };
    TiledMap.prototype.getGroupLayer = function (name) {
        var layer = this.src.layers
            .find(function (layer) { return layer.type === "group" && layer.name === name; });
        if (layer) {
            return new TiledMapLayer(this, layer);
        }
    };
    TiledMap.prototype.getLayer = function (name) {
        return this.layers.find(function (layer) { return layer.name === name; });
    };
    TiledMap.prototype.getHeight = function () {
        return this.src.height;
    };
    TiledMap.prototype.getHeightInPixels = function () {
        return this.src.height * this.src.tileheight;
    };
    TiledMap.prototype.getWidth = function () {
        return this.src.width;
    };
    TiledMap.prototype.getWidthInPixels = function () {
        return this.src.width * this.src.tilewidth;
    };
    TiledMap.prototype.getTileHeight = function () {
        return this.src.tileheight;
    };
    TiledMap.prototype.getTileWidth = function () {
        return this.src.tilewidth;
    };
    TiledMap.prototype.getTilesets = function () {
        return this.src.tilesets;
    };
    return TiledMap;
}());
exports.TiledMap = TiledMap;
