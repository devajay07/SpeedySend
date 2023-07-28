const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(morgan("dev"));

const port = 4000;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/guide", (req, res) => {
  res.render("guide.ejs");
});

app.get("/info", (req, res) => {
  res.send("Helllo");
});

// const usertosocketMapping = new Map();
const sockettouserMapping = new Map();

io.on("connection", (socket) => {
  // Triggered when a peer hits the join room button.
  socket.on("join", (data) => {
    const { roomId, username } = data;
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(roomId);

    if (room === undefined) {
      socket.join(roomId);
      sockettouserMapping.set(socket.id, username);
      socket.emit("created", { roomId, username });
    } else if (room.size === 1) {
      socket.join(roomId);
      const firstUserSocketId = [...sockettouserMapping.keys()][0];
      const firstUserUsername = sockettouserMapping.get(firstUserSocketId);
      socket.emit("joined", { roomId, username, firstUserUsername });
    } else {
      // when there are already two people inside the room.
      socket.emit("full");
    }
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    socket.broadcast.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("ready", (roomId, username) => {
    socket.broadcast.to(roomId).emit("ready", username);
  });

  socket.on("offer", (offer, roomId) => {
    socket.broadcast.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.broadcast.to(roomId).emit("answer", answer);
  });

  socket.on("leave", (roomId, username) => {
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit("leave", username);
  });
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
