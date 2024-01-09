import { WorldMapChange } from "../../domain/entities/world/WorldMapChange";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export class PlayerChangeMapListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addPlayerChangeMapListener(this);
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