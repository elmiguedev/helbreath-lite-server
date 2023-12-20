import { Position } from "./Position";

export interface Player {
  id: string;
  name: string;
  position: Position;
  target?: Position;
  worldMapId: string;
}