import { Monster } from "../../domain/entities/monster/Monster";
import { MonsterService } from "../../domain/services/monster/MonsterService";
import { ServiceListener } from "../../utils/ServiceListener";

export class MonsterKilledListener implements ServiceListener<Monster> {
  private listeners: ServiceListener<Monster>[] = [];

  constructor(
    private readonly monsterService: MonsterService
  ) {
    this.monsterService.addMonsterKilledListener(this);
  }

  public notify(monster: Monster): void {
    this.listeners.forEach(listener => {
      listener.notify(monster);
    })
  }

  public suscribe(listener: ServiceListener<Monster>) {
    this.listeners.push(listener);
  }
}