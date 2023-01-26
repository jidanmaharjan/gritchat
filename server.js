const express = require("express");

const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

require("dotenv").config({});
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.0.111:3000",
      "http://192.168.0.107:3000",
      "https://gritchat.onrender.com",
    ],
  },
});

const Members = require("./model/memberModel");

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room.room);
    console.log(`User ${socket.id} joined ${room.room}`);
    socket.to(room.room).emit("joinRoom", room);
  });
  socket.on("leaveRoom", (data) => {
    socket.leave(data.room);
    socket.to(data.room).emit("leaveRoom", data);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

app.use(express.static(path.join(__dirname, "../client/build/")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
