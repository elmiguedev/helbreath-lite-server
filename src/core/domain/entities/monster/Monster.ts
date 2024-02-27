import { Position } from "../generic/Position";
import { Size } from "../generic/Size";
import { MonsterStats } from "./MonsterStats";

export interface Monster {
  id: string;
  worldMapId: string;
  name: string;
  type: string;
  position: Position;
  size: Size;
  stats: MonsterStats;
}