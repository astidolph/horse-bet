function setupSocketHandlers(io, db) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("newUser", async (newUser) => {
      console.log(newUser);
      try {
        await db.run("INSERT INTO user (name) VALUES (?)", newUser);
      } catch (e) {
        console.error("Failed to insert new user:", e);
        return;
      }
      io.emit("newUser", newUser);
    });

    socket.on("startGame", async () => {
      console.log("game started");
      try {
        await db.run("INSERT INTO gameState (gameStarted) VALUES (?)", true);
      } catch (e) {
        console.error("Failed to start game:", e);
        return;
      }
      io.emit("gameStarted", true);
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected!");
    });
  });
}

module.exports = { setupSocketHandlers };
