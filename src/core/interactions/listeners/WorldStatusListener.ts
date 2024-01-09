import { WorldStatus } from "../../domain/entities/world/WorldStatus";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export class WorldStatusListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addWorldStatusListener(this);
  }

  public notify(worldMapStatus: WorldStatus): void {
    this.listeners.forEach(listener => {
      listener.notify(worldMapStatus);
    })
  }

  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}