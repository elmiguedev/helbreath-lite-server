import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { WorldMapRepository } from "../../../domain/repositories/worldmap/WorldMapRepository";
import { TiledMap, TiledMapObject } from "../../../utils/TiledMap";
import { SolidBlock } from "../../../domain/entities/world/SolidBlock";

import TestMapJson from "../../../../../../helbreath-lite-client/src/assets/tilemaps/test/test.json";
import HouseMapJson from "../../../../../../helbreath-lite-client/src/assets/tilemaps/house/house.json";

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private tiledMaps: Record<string, TiledMap>;
  private worldMaps: Map<string, WorldMap>;

  constructor() {
    this.worldMaps = new Map();
    this.tiledMaps = {
      testMap: new TiledMap(TestMapJson),
      house: new TiledMap(HouseMapJson),
    };
    this.createWorldMaps();
  }

  private createWorldMaps() {
    Object.keys(this.tiledMaps).forEach((worldMapId: string) => {
      const tiledMap = this.tiledMaps[worldMapId];
      const map: WorldMap = {
        id: worldMapId,
        name: worldMapId,
        size: {
          width: tiledMap.getWidthInPixels(),
          height: tiledMap.getHeightInPixels(),
        },
        solids: [],
        portals: [],
      }

      // obtenemos la capa solida
      const solidLayer = tiledMap.getLayer("control");
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
          map.solids.push(solidBlock);
        });
      }

      // obtenemos la capa de objetos para los portales
      const objectsLayer = tiledMap.getLayer("objects");
      if (objectsLayer?.objects) {
        objectsLayer.objects.forEach((object: TiledMapObject) => {
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
                worldMapId: object.properties.find(p => p.name === "targetWorldMapId")?.value,
                position: {
                  x: object.properties.find(p => p.name === "targetPositionX")?.value,
                  y: object.properties.find(p => p.name === "targetPositionY")?.value
                }
              }
            })
          }
        });
      }

      // agregamos el mapa
      this.worldMaps.set(map.id, map);
    })
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