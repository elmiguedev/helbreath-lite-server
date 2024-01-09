import { Monster } from "../../domain/entities/monster/Monster";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export interface MonsterKilledListenerParams {
  monster: Monster
}

export class MonsterKilledListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addMonsterKilledListener(this);
  }

  public notify(params: MonsterKilledListenerParams): void {
    this.listeners.forEach(listener => {
      listener.notify(params);
    })
  }

  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}