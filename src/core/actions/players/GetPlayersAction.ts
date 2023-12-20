import { Player } from "../../domain/entities/Player";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { Action } from "../Action";

export class GetPlayersAction implements Action<void, Player[]> {
  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(): Player[] {
    return this.playerRepository.getPlayers();
  }
}