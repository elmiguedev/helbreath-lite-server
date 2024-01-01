import { PlayerAttributes } from "./PlayerAttributes";
import { PlayerStats } from "./PlayerStats";
import { Position } from "../generic/Position";
import { Size } from "../generic/Size";

export interface Player {
  id: string;
  name: string;
  position: Position;
  target?: Position;
  worldMapId: string;
  bounds: Size;
  stats: PlayerStats;
  attributes: PlayerAttributes;
}