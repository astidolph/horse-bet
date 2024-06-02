const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

const { setupDatabase } = require("./db");
const { setupSocketHandlers } = require("./socketHandlers");

const port = 3000;

async function main() {
  const db = await setupDatabase();

  setupSocketHandlers(io, db);

  httpServer.listen(port, () => console.log(`listening on port ${port}`));
}

main();
