import { Position } from "./Position"
import { Size } from "./Size";

export interface Portal {
  id: string
  worldMapId: string;
  position: Position;
  size: Size;
  targetWorldMapId: string;
  targetPosition: Position;
}