import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export class PortalCollisionListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addPortalCollisionListener(this);
  }

  public notify(changes: WorldMapChange[]): void {
    this.listeners.forEach(listener => {
      listener.notify(changes);
    })
  }

  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}