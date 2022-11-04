const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-front-swart.vercel.app",
    credentials: true,
  },
});

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});
app.use(express.static("public"));

const port = process.env.PORT || 3500;

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to the db")
);

server.listen(port, () =>
  console.log(`Server started on Port ${process.env.PORT}`)
);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("a user connected");
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("sent message:", data.message);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
      console.log("recieved msg: ", data.message);
    }
  });
});

module.exports = app;
