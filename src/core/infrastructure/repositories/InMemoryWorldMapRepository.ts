import { WorldMap } from "../../domain/entities/world/WorldMap";
import { WorldMapRepository } from "../../domain/repositories/WorldMapRepository";
import { TiledMap, TiledMapLayer } from "../../utils/TiledMap";

import TestMapJson from "../../../../../helbreath-lite-client/src/assets/tilemaps/test/test.json";
import { SolidBlock } from "../../domain/entities/world/SolidBlock";
import p2 from "p2";


export class InMemoryWorldMapRepository implements WorldMapRepository {
  private tiledMaps: TiledMap;
  private worldMaps: Map<string, WorldMap>;

  constructor(private readonly world: p2.World) {
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
        const body = new p2.Body({
          mass: 0,
          position: [tile.x, tile.y],
        });
        body.addShape(new p2.Box({ width: tile.width, height: tile.height }));
        body.collisionResponse = true
        body.shapes[0].collisionGroup = 1
        body.shapes[0].collisionMask = 1
        this.world.addBody(body);
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

  // public getSolidLayerById(id: string): TiledMapLayer | undefined {
  //   const worldMapLayer = this.tiledMaps.getGroupLayer(id);
  //   if (worldMapLayer) {
  //     return worldMapLayer.getLayer("control");
  //   }
  // }



}