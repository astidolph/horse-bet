const express = require("express");
const http = require("http");
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

async function main() {
  const db = await setupDatabase();

  if (!db) {
    console.error("Failed to set up database.");
    return;
  }

  // TODO: Move to file
  app.get("/api/horses", async (req, res) => {
    try {
      const rows = await db.all("SELECT * FROM horse");
      res.json(rows);
    } catch (err) {
      console.error("Database query error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/test", (req, res) => {
    res.json({ message: "Test endpoint works!" });
  });

  setupSocketHandlers(io, db);

  httpServer.listen(port, () => console.log(`listening on port ${port}`));
}

main();
