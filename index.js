const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

const port = 4000;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:id", (req, res) => {
  res.render("share");
});

const usertosocketMapping = new Map();
const sockettouserMapping = new Map();


io.on("connection", (socket) => {
  // Triggered when a peer hits the join room button.
  socket.on("join", (data) => {
    const {roomId,username} = data;
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(roomId);
 

    if (room === undefined) {
      socket.join(roomId);
      console.log('new room created');
    } else if (room.size === 1){
      socket.join(roomId);
      socket.emit("joined", { roomId, username });
    } else {
      // when there are already two people inside the room.
      socket.emit("full");
    }
  });

  socket.on("ready", (roomId) => {
    socket.broadcast.to(roomId).emit("ready");
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    console.log("candidate", candidate);
    socket.broadcast.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("offer", (offer, roomId) => {
    console.log("offer", offer);
    socket.broadcast.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    console.log("answer", answer);
    socket.broadcast.to(roomId).emit("answer", answer);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit("leave");
  });
});

  server.listen(process.env.PORT || port, () => {
   console.log(`Server is running on port ${port}`);
});
