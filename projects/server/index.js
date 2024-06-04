const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { setupDatabase } = require("./db");
const { setupSocketHandlers } = require("./socketHandlers");

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: { origin: "*" },
});

const port = 3000;

async function main() {
  const db = await setupDatabase();

  // TODO: Move to file
  app.get("/api/horses", (req, res) => {
    db.all("SELECT * FROM horse", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ horses: rows });
    });
  });

  setupSocketHandlers(io, db);

  httpServer.listen(port, () => console.log(`listening on port ${port}`));
}

main();
