export interface TiledMapLayerProps {
  id: number;
  data?: number[];
  layers?: TiledMapLayerProps[];
  objects?: TiledMapObject[];
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  x: number;
  y: number;
}

export interface TiledMapTileProperty {
  name: string;
  type: string;
  value: any;
}

export interface TiledMapTile {
  id: number;
  properties: TiledMapTileProperty[];
}

export interface TiledMapObject {
  id: number;
  gid: number;
  name: string;
  height: number;
  width: number;
  x: number;
  y: number;
  visible: boolean;
  type: string;
  properties: TiledMapTileProperty[];
}

export class TiledMapLayer {
  private tilemap: TiledMap;
  public id: number;
  public data?: number[];
  public layers?: TiledMapLayer[];
  public objects?: TiledMapObject[];
  public name: string;
  public opacity: number;
  public type: string;
  public visible: boolean;
  public x: number;
  public y: number;

  constructor(tilemap: TiledMap, props: TiledMapLayerProps) {
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
      props.layers.forEach((layer: TiledMapLayerProps) => {
        this.layers!.push(new TiledMapLayer(this.tilemap, layer));
      })
    }

  }

  public getLayer(name: string): TiledMapLayer | undefined {
    return this.layers!.find((layer: TiledMapLayer) => layer.name === name);
  }

  public getTile(id: number) {
    const tileset = this.tilemap.getTilesets().find((tileset: TileMapTileset) => tileset.firstgid >= id);
    if (tileset?.tiles) {
      return tileset.tiles.find((tile: TiledMapTile) => tile.id === id - tileset.firstgid);
    }
  }

  // TODO: refactor, hacer que sea por id o por prop,
  public getExistingTiles() {
    const tileSize = 16;
    const tiles = [];

    for (let i = 0; i < this.data!.length; i++) {
      const tileData = this.data![i];
      if (tileData > 0) {
        const tileX = (i % this.tilemap.getWidth()) * tileSize;
        const tileY = Math.floor(i / this.tilemap.getWidth()) * tileSize;
        tiles.push({
          x: tileX,
          y: tileY,
          width: tileSize,
          height: tileSize
        })
      }
    }

    console.log(tiles);

    return tiles;
  }

  public getTileFromPosition(x: number, y: number) {
    const currentTile = Math.floor(x / this.tilemap.getTileWidth()) + Math.floor(y / this.tilemap.getTileHeight()) * this.tilemap.getWidth();
    const tileId = this.data![currentTile];
    return this.getTile(tileId);
  }

  public getObjectFromPosition(x: number, y: number): TiledMapObject | undefined {
    return this.objects?.find((object: TiledMapObject) => {
      return x >= object.x && x <= object.x + object.width &&
        y >= object.y && y <= object.y + object.height
    });
  }

}

export interface TileMapTileset {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  tiles: TiledMapTile[];
}

export class TiledMap {
  private src: any;
  private layers: TiledMapLayer[] = [];

  constructor(src: any) {
    this.src = src;
    if (this.src.layers) {
      this.src.layers.forEach((layer: TiledMapLayerProps) => {
        this.layers.push(new TiledMapLayer(this, layer));
      })
    }
  }

  public getGroupLayers(): TiledMapLayer[] {
    return this.src.layers
      .filter((layer: TiledMapLayerProps) => layer.type === "group")
      .map((layer: TiledMapLayerProps) => new TiledMapLayer(this, layer));
  }

  public getGroupLayer(name: string): TiledMapLayer | undefined {
    const layer = this.src.layers
      .find((layer: TiledMapLayerProps) => layer.type === "group" && layer.name === name)
    if (layer) {
      return new TiledMapLayer(this, layer);
    }
  }

  public getLayer(name: string): TiledMapLayer | undefined {
    return this.layers!.find((layer: TiledMapLayer) => layer.name === name);
  }


  public getHeight() {
    return this.src.height;
  }

  public getHeightInPixels() {
    return this.src.height * this.src.tileheight;
  }

  public getWidth() {
    return this.src.width;
  }

  public getWidthInPixels() {
    return this.src.width * this.src.tilewidth;
  }

  public getTileHeight() {
    return this.src.tileheight;
  }

  public getTileWidth() {
    return this.src.tilewidth;
  }

  public getTilesets(): TileMapTileset[] {
    return this.src.tilesets;
  }

}