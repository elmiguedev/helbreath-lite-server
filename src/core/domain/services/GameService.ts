import { Monster } from "../entities/monster/Monster";
import { Player } from "../entities/player/Player";
import { GameServiceListener } from "./GameServiceListener";

export interface GameService {
  addWorldStatusListener(listener: GameServiceListener): void;
  addPlayerAttackListener(listener: GameServiceListener): void;
  addPlayerChangeMapListener(listener: GameServiceListener): void;
  addMonsterKilledListener(listener: GameServiceListener): void;

  start(): void;

  addPlayer(player: Player): void;
  getPlayer(playerId: string): Player | undefined;
  removePlayer(playerId: string): void;
  attack(playerId: string): void; // TODO: cambiar logica del listener

  addMonster(monster: Monster): void;
  getMonster(monsterId: string): Monster | undefined;
  removeMonster(monsterId: string): void;
  killMonster(monsterId: string): void;

}


// // ACCIONES
// - CreatePlayer ✅
//   - MovePlayer ✅
//   - RemovePlayer ✅
//   - AttackMonster✅
//   - AttackPlayer
//   - UpdatePlayerStats

//   // LISTENERS
//   - WorldStatus ✅
//   - PlayerAttack ✅
//   - PlayerChangeMap ✅
//   - PlayerDisconnected
//   - PlayerHurt
//   - PlayerDead
//   - PlayerLevelUp
//   - MonsterAttack
//   - MonsterHurt
//   - MonsterDead ✅

//   // VALIDACIONES Y ACTUALIZAIONES
//   - Player Loop
//     - Update Player Position
//     - Check Player Collisions
//     - Check Player Portals

//   - Monster Loop
//     - Update Monster Position(AI logic)
//     - Check Monster Collisions
//     - Check Player Target(o sea cuando esta en la zona de ataque)
