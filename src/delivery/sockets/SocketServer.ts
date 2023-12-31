import { Server as HttpServer } from "node:http";
import { Server as Server, Socket } from "socket.io";
import { Player } from "../../core/domain/entities/player/Player";

export class SocketServer {
  // private socketServer: Server;
  // private rooms: Record<string, Room> = {};

  // constructor(httpServer: HttpServer) {
  //   this.socketServer = new Server(httpServer, {
  //     cors: {
  //       origin: "*"
  //     }
  //   });

  //   this.createRoom("world");
  //   const worldRoom = this.getRoom("world");

  //   worldRoom.onRefresh = () => {
  //     this.socketServer.emit("world:state", worldRoom.getState());
  //     // console.log(worldRoom.getState());
  //   }
  //   worldRoom.createGameLoop();

  //   this.socketServer.on("connection", (socket: Socket) => {
  //     // const room = this.getRoom("world");
  //     // const player = new Player(socket.id)
  //     // room.addPlayer(player);

  //     // socket.emit("world:state", room.getState())
  //     // socket.broadcast.emit("player:connected", player.getState());

  //     // socket.on("disconnect", () => {
  //     //   console.log("client disconnected", socket.id);
  //     //   room.removePlayer(socket.id);
  //     //   this.socketServer.emit("player:disconnected", socket.id);
  //     // });

  //     // socket.on("player:move", ({ x, y }) => {
  //     //   console.log("player move", socket.id, x, y);
  //     //   const player = room.getPlayer(socket.id);
  //     //   player.setTarget({ x, y });
  //     // })


  //   });
}

//   private createRoom(name: string) {
//   this.rooms[name] = new Room(name);
// }

//   private getRoom(name: string) {
//   return this.rooms[name];
// }
// }