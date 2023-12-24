import { TiledMapLayer } from "../../utils/TiledMap";
import { Bounds } from "./Bounds";
import { Portal } from "./Portal";
import { Position } from "./Position";

export interface WorldMapProps {
  id: string;
  name: string;
}

export class WorldMap {
  public id: string;
  public name: string;

  private layer: TiledMapLayer;

  constructor(props: WorldMapProps, layer: TiledMapLayer) {
    this.id = props.id;
    this.name = props.name;
    this.layer = layer;
  }

  public isSolidPosition(position: Position): boolean { // TODO: esto deberia devolver otra cosa no un numero
    const controlLayer = this.layer.getLayer("control");
    if (controlLayer) {
      const tile = controlLayer.getTileFromPosition(position.x, position.y);
      if (tile && tile.properties.some(prop => prop.name === 'solid' && prop.value === true)) {
        return true;
      }
    }
    return false;
  }

  public getPortalFromPosition(position: Position): Portal | undefined {
    const objectsLayer = this.layer.getLayer("objects");
    if (objectsLayer) {
      const object = objectsLayer.getObjectFromPosition(position.x, position.y);
      if (object && object.type === "portal") {
        return {
          id: "",
          worldMapId: this.id,
          position: { x: object.x, y: object.y },
          targetWorldMapId: object.properties.find(prop => prop.name === "targetWorldId")!.value,
          targetPosition: {
            x: object.properties.find(prop => prop.name === "targetPositionX")!.value,
            y: object.properties.find(prop => prop.name === "targetPositionY")!.value
          },
          size: {
            width: object.width,
            height: object.height
          }
        }
      }
    }


  }

  public getStatus() {
    return {
      id: this.id,
      name: this.name
    }
  }
}