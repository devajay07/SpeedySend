const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const port = 4000;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/guide", (req, res) => {
  res.render("guide.ejs");
});

app.get("/info", (req, res) => {
  res.render("info.ejs");
});

app.get("/feedback", (req, res) => {
  res.render("feedback.ejs");
});

app.post("/submit-feedback", (req, res) => {
  const { email, feedback } = req.body;
  const currentDate = new Date().toISOString().split("T")[0];
  const feedbackText = `Email: ${email || null}\nFeedback: ${feedback}\n\n`;

  const feedbackFilePath = path.join(__dirname, "feedback", "feedback.txt");

  fs.readFile(feedbackFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading feedback file:", err);
      return res.status(500).json({ success: false });
    }

    const existingFeedback = data.trim();
    const feedbackEntries = existingFeedback.split(/\n\d{4}-\d{2}-\d{2}\n/);
    const lastFeedbackDate =
      feedbackEntries[feedbackEntries.length - 1].split("\n")[0];

    if (lastFeedbackDate === currentDate) {
      // Append to existing feedback for the current date
      fs.appendFile(feedbackFilePath, feedbackText, (appendErr) => {
        if (appendErr) {
          console.error("Error writing feedback:", appendErr);
          return res.status(500).json({ success: false });
        } else {
          return res.status(200).json({ success: true });
        }
      });
    } else {
      // Create a new entry with the current date
      const newFeedbackEntry = `\n${currentDate}\n\n${feedbackText}`;
      fs.appendFile(feedbackFilePath, newFeedbackEntry, (appendErr) => {
        if (appendErr) {
          console.error("Error writing feedback:", appendErr);
          return res.status(500).json({ success: false });
        } else {
          return res.status(200).json({ success: true });
        }
      });
    }
  });
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
