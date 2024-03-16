import { ServiceListener } from "../../../utils/ServiceListener";
import { Player } from "../../entities/player/Player";
import { WorldMap } from "../../entities/world/WorldMap";
import { WorldMapChange } from "../../entities/world/WorldMapChange";

export interface PlayerService {
  addPlayerAttackListener(listener: ServiceListener<string>): void;
  addPlayerChangeMapListener(listener: ServiceListener<WorldMapChange[]>): void;
  addLevelUpListener(listener: ServiceListener<Player>): void

  notifyPlayerAttack(playerId: string): void;

  addPlayer(player: Player): void;
  getPlayer(playerId: string): Player | undefined;
  removePlayer(playerId: string): void;
  movePlayer(player: Player, worldMap: WorldMap): void;
  updatePlayersPosition(worldMap: WorldMap): void;
  addPlayerExperience(playerId: string, experience: number): void;

  getPlayerHitRatio(player: Player): number;
  getPlayerDamage(player: Player, enemyPhysicalAbsortion?: number): number;
  isAttackSuccess(hitRatio: number, defenseRatio: number): boolean;
}