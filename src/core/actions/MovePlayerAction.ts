import { Position } from "../entities/Position";
import { Room } from "../entities/Room";
import { Action } from "./Action";

export interface MovePlayerActionParams {
  id: string;
  position: Position;
}

export class MovePlayerAction implements Action<MovePlayerActionParams, void> {
  constructor(private readonly room: Room) { }

  public execute(params: MovePlayerActionParams): void {
    const { id, position } = params;
    const player = this.room.getPlayer(id);
    if (player) {
      player.setTarget(position);
    }

  }
}