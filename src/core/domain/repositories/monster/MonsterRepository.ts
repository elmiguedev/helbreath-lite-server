import { Monster } from "../../entities/monster/Monster";

export interface MonsterRepository {
  add(monster: Monster): void;
  remove(id: string): Monster | undefined;
  getById(id: string): Monster | undefined;
  getAll(): Monster[];
  update(monster: Monster): void;
  getByWorldMap(worldMapId: string): Monster[];
}