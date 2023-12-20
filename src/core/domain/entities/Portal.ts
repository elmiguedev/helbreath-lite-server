import { Position } from "./Position"

export interface Portal {
  id: string
  worldMapId: string;
  position: Position
  targetWorldMapId: string;
  targetPosition: Position;
}