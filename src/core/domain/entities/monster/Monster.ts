import { Position } from "../generic/Position";
import { Size } from "../generic/Size";

export interface Monster {
  id: string;
  worldMapId: string;
  name: string;
  type: string;
  health: number;
  hitRatio: number;
  defenseRatio: number;
  damage: number;
  position: Position;
  size: Size;
}