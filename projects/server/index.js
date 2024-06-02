const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

const port = 3000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("newUser", (newUser) => {
    console.log(newUser);
    io.emit("newUser", `${socket.id.substr(0, 2)}: ${newUser}`);
  });

  socket.on("startGame", () => {
    console.log("game started");
    io.emit("gameStarted");
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));
