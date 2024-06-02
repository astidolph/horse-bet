const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const port = 3000;

async function main() {
  // open the database file
  const db = await open({
    filename: "horseBet.db",
    driver: sqlite3.Database,
  });

  await db.exec("DROP TABLE user");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    );
  `);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("newUser", async (newUser) => {
      console.log(newUser);
      let result;
      try {
        // store the message in the database
        result = await db.run("INSERT INTO user (name) VALUES (?)", newUser);
      } catch (e) {
        // TODO handle the failure
        return;
      }
      io.emit("newUser", newUser);
    });

    socket.on("startGame", () => {
      console.log("game started");
      io.emit("gameStarted");
    });

    socket.on("disconnect", async () => {
      console.log("a user disconnected!");
    });
  });

  httpServer.listen(port, () => console.log(`listening on port ${port}`));
}

main();
