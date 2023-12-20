import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { Action } from "../Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
  worldMapId: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {

  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(params: CreatePlayerActionParams): void {
    this.playerRepository.addPlayer({
      id: params.id,
      name: params.name,
      worldMapId: params.worldMapId,
      position: {
        x: 0,
        y: 0
      }
    })
  }
}