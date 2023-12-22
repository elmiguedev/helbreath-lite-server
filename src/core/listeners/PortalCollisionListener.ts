import { WorldMapChange } from "../domain/entities/WorldMapChange";
import { GameService } from "../domain/services/GameService";
import { GameServiceListener } from "../domain/services/GameServiceListener";

// TODO: como el action. aca podriamos ponerle un generico para la devolucion del tipo de datos
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

  // TODO: investigar event listener
  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}