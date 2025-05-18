require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { sequelize, User, Room, Message } = require("./models");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", async ({ roomName }) => {
    socket.join(roomName);
  });

  socket.on("sendMessage", async ({ content, roomName, userId }) => {
    const room = await Room.findOrCreate({ where: { name: roomName } });
    const message = await Message.create({
      content,
      UserId: userId,
      RoomId: room[0].id,
    });

    io.to(roomName).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server and sync DB
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
