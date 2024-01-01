import { Monster } from "../monster/Monster";
import { Player } from "../player/Player";

export interface WorldStatus {
  world: any;
  players: Player[];
  monsters: Monster[];
}