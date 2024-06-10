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
}

module.exports = { setupSocketHandlers };
