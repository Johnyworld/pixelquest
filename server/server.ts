import * as socketio from "socket.io";

let io = socketio(7000);

io.on("connection", function(socket: any) {
  console.log("a user connected");
});
