const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { readFile } = require("fs").promises;
const path = require("path");

async function setupDatabase() {
  try {
    const db = await open({
      filename: "horseBet.db",
      driver: sqlite3.Database,
    });

    // Read the schema file
    const schemaPath = path.resolve(__dirname, "schema.sql");
    const schema = await readFile(schemaPath, "utf-8");

    // Execute the schema SQL commands
    await db.exec(schema);

    console.log("Database initialized with schema.");
    return db;
  } catch (error) {
    console.error("Error setting up the database:", error.message);
    throw error;
  }
}

module.exports = { setupDatabase };
