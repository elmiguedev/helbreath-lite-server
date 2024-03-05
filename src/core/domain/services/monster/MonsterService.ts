import { ServiceListener } from "../../../utils/ServiceListener";
import { Monster } from "../../entities/monster/Monster";

export interface MonsterService {
  addMonsterKilledListener(listener: ServiceListener<Monster>): void;
  addMonster(monster: Monster): void;
  getMonster(monsterId: string): Monster | undefined;
  getMonstersByWorldMap(worldMapId: string): Monster[];
  removeMonster(monsterId: string): Monster | undefined;
  killMonster(monsterId: string): void;
}