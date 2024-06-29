const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const cors = require("cors");
const { setupDatabase } = require("./db");
const { setupSocketHandlers } = require("./socketHandlers");

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: { origin: "*" },
});

const port = 3000;

app.use(cors());
app.use(bodyParser.json());

async function main() {
  const db = await setupDatabase();

  if (!db) {
    console.error("Failed to set up database.");
    return;
  }

  io.on("connection", (socket) => {
    console.log("a user connected");

    // API CALLS
    app.get("/api/horses", async (req, res) => {
      try {
        const rows = await db.all("SELECT * FROM horse");
        res.json(rows);
      } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/gameState", async (req, res) => {
      try {
        const rows = await db.all("SELECT * FROM gameState");
        res.json(rows);
      } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/users", async (req, res) => {
      try {
        const rows = await db.all("SELECT * FROM user");
        res.json(rows);
      } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/users", async (req, res) => {
      const { name } = req.body;
      console.log("Adding user: ", name);

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      try {
        const result = await db.run("INSERT INTO user (name) VALUES (?)", [
          name,
        ]);
        const userId = result.lastID;

        console.log("New user added id: ", userId);
        console.log("New user added: ", name);

        io.emit("newUser", { id: userId, name: name });

        res.status(201).json({ id: userId, name: name });
      } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/test", (req, res) => {
      res.json({ message: "Test endpoint works!" });
    });

    // WEB SOCKET CONNECTIONS

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

    socket.on("generateHorses", async (horses) => {
      console.log("generate horses: ", JSON.stringify(horses));

      // Start a transaction
      await db.run("BEGIN TRANSACTION");

      try {
        // Insert each horse one by one
        for (const horse of horses) {
          await db.run(
            "INSERT INTO horse (name, odds, percentageOdds, fractionalOdds, decimalOdds, colour, speed, timingFunction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              horse.name,
              horse.odds,
              horse.percentageOdds,
              horse.fractionalOdds,
              horse.decimalOdds,
              horse.colour,
              horse.speed,
              horse.timingFunction,
            ]
          );
        }

        // Commit the transaction
        await db.run("COMMIT");
      } catch (e) {
        // Rollback the transaction in case of an error
        await db.run("ROLLBACK");
        console.error("Failed to save generated horses:", e);
        return;
      }

      io.emit("horsesGenerated", horses);
    });

    socket.on("makeBet", async (bet) => {
      const { playerId, amount, horseId } = bet;
      console.log(`Player ${playerId} betting ${amount} on ${horseId}`);
      try {
        await db.run(
          "INSERT OR REPLACE INTO playerBets (horseId, userId, amount) VALUES (?, ?, ?)",
          [horseId, playerId, amount]
        );
      } catch (e) {
        console.error("Failed to make bet:", e);
        return;
      }
      io.emit("betMade", {
        horseId: horseId,
        playerId: playerId,
        amount: amount,
      });
    });
  });

  // setupSocketHandlers(io, db);

  httpServer.listen(port, () => console.log(`listening on port ${port}`));
}

main();
