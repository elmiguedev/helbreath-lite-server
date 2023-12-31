import { WorldMapChange } from "../entities/world/WorldMapChange";
import { GameServiceListener } from "./GameServiceListener";

export interface GameService {
  addWorldMapTickListener(listener: GameServiceListener): void;
  addPortalCollisionListener(listener: GameServiceListener): void;
  start(): void;
}