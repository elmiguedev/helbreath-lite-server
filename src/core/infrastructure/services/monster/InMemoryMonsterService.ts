import { Monster } from "../../../domain/entities/monster/Monster";
import { MonsterRepository } from "../../../domain/repositories/monster/MonsterRepository";
import { MonsterService } from "../../../domain/services/monster/MonsterService";
import { MathUtils } from "../../../utils/MathUtils";
import { ServiceListener } from "../../../utils/ServiceListener";

export class InMemoryMonsterService implements MonsterService {

  private monsterKilledListeners: ServiceListener<Monster>[] = [];

  constructor(
    private readonly monsterRepository: MonsterRepository
  ) { }


  public addMonster(monster: Monster): void {
    if (!this.monsterRepository.getById(monster.id)) {
      this.monsterRepository.add(monster)
    }
  }

  public getMonster(monsterId: string): Monster | undefined {
    return this.monsterRepository.getById(monsterId);
  }

  public removeMonster(monsterId: string): Monster | undefined {
    return this.monsterRepository.remove(monsterId);
  }

  public killMonster(monsterId: string): void {
    const monster = this.monsterRepository.remove(monsterId);
    if (monster) {
      this.monsterKilledListeners.forEach(listener => {
        listener.notify(monster);
      })
    }
  }

  public addMonsterKilledListener(listener: ServiceListener<Monster>): void {
    this.monsterKilledListeners.push(listener)
  }

  public getMonstersByWorldMap(worldMapId: string): Monster[] {
    return this.monsterRepository.getByWorldMap(worldMapId);
  }

  public getMonsterExperience(monster: Monster): number {
    return MathUtils.getIntegerBetween(
      monster.stats.minExperience,
      monster.stats.maxExperience
    );
  }

}