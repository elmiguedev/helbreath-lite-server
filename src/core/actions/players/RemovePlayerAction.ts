import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { Action } from "../Action";

export interface RemovePlayerActionParams {
  id: string;
}

export class RemovePlayerAction implements Action<RemovePlayerActionParams, void> {

  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(params: RemovePlayerActionParams): void {
    this.playerRepository.removePlayer(params.id)
  }
}