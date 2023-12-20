import { Player } from "../../domain/entities/Player";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { MathUtils } from "../../utils/MathUtils";
import { Action } from "../Action";

export class UpdatePlayersPositionsAction implements Action<string, void> {
  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(worldMapId: string): void {
    const players = this.playerRepository.getPlayersByWorldMap(worldMapId);
    players.forEach(player => {
      if (player.target) {
        this.updatePlayerPositionLinealStartegy(player);
        this.playerRepository.updatePlayer(player);
      }
    });
  }

  private updatePlayerPositionLerpStrategy(player: Player): void {
    if (player.target) {
      const x = MathUtils.lerp(player.position.x, player.target.x, 1, 10);
      const y = MathUtils.lerp(player.position.y, player.target.y, 1, 10);
      player.position = { x, y };
    }
  }

  private updatePlayerPositionLinealStartegy(player: Player): void {
    if (player.target) {
      const MAX_SPEED = 4;
      const distance = Math.sqrt(Math.pow(player.target.x - player.position.x, 2) + Math.pow(player.target.y - player.position.y, 2));
      if (distance <= MAX_SPEED) {
        player.position = player.target;
        player.target = undefined;
      } else {

        const cos = (player.target.x - player.position.x) / distance;
        const sin = (player.target.y - player.position.y) / distance;
        const max_x_speed = MAX_SPEED * cos;
        const max_y_speed = MAX_SPEED * sin;
        const x = player.position.x + max_x_speed;
        const y = player.position.y + max_y_speed;
        player.position = { x, y };
      }




    }
  }

  private updatePlayerPositionDirectStrategy(player: Player): void {
    if (player.target) {
      player.position = player.target;
    }
  }

}