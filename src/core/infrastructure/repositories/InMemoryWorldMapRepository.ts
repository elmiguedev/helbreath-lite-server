import { WorldMap } from "../../domain/entities/world/WorldMap";
import { WorldMapRepository } from "../../domain/repositories/WorldMapRepository";
import { TiledMap, TiledMapLayer } from "../../utils/TiledMap";

import TestMapJson from "../../../../../helbreath-lite-client/src/assets/tilemaps/test/test.json";
import { SolidBlock } from "../../domain/entities/world/SolidBlock";

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private tiledMaps: TiledMap;
  private worldMaps: Map<string, WorldMap>;

  constructor() {
    this.worldMaps = new Map();
    this.tiledMaps = new TiledMap(TestMapJson);
    this.createWorldMaps();
  }

  private createWorldMaps() {
    const testMapTilemap = new TiledMap(TestMapJson);
    const testMap: WorldMap = {
      id: "testMap",
      name: "testMap",
      size: {
        width: testMapTilemap.getWidthInPixels(),
        height: testMapTilemap.getHeightInPixels(),
      },
      solids: [],
      portals: [],
    }

    // obtenemos la capa solida
    const solidLayer = testMapTilemap.getLayer("control");
    if (solidLayer) {
      const tiles = solidLayer.getExistingTiles();
      tiles.forEach((tile: any) => {
        const solidBlock: SolidBlock = {
          size: {
            width: tile.width,
            height: tile.height
          },
          position: {
            x: tile.x,
            y: tile.y
          }
        };
        testMap.solids.push(solidBlock);
      });
    }



    this.worldMaps.set(testMap.id, testMap);
  }

  public getAll(): WorldMap[] {
    return Array.from(this.worldMaps.values());
  }

  public addMap(worldMap: WorldMap): void {
    this.worldMaps.set(worldMap.id, worldMap);
  }

  public getById(id: string): WorldMap | undefined {
    return this.worldMaps.get(id);
  }

}