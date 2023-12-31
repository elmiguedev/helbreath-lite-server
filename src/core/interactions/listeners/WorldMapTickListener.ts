import { WorldStatus } from "../../domain/entities/world/WorldStatus";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export class WorldMapTickListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addWorldMapTickListener(this);
  }

  public notify(worldMapStatus: WorldStatus): void {
    this.listeners.forEach(listener => {
      listener.notify(worldMapStatus);
    })
  }

  // TODO: investigar event listener
  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}