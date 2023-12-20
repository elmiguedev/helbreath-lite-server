import { Player } from "./Player";
import { WorldMap } from "./WorldMap";

export interface WorldStatus {
  world: WorldMap;
  players: Player[];
}