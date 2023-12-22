import { GameService } from "../../domain/services/GameService";
import { Action } from "../Action";

export class StartGameAction implements Action<void, void> {
  constructor(private readonly gameService: GameService) { }

  execute(): void {
    this.gameService.start();
  }
}