import { Player } from "./Player";
import { WorldMap, WorldMapProps } from "./WorldMap";

export interface WorldStatus {
  world: WorldMapProps;
  players: Player[];
}