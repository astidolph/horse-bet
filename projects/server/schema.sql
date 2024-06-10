DROP TABLE IF EXISTS playerBets;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS gameState;
DROP TABLE IF EXISTS horse;

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS gameState (
    gameStarted BOOLEAN
);

CREATE TABLE IF NOT EXISTS horse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    odds INTEGER,
    percentageOdds INTEGER,
    fractionalOdds INTEGER,
    decimalOdds INTEGER,
    colour TEXT,
    speed INTEGER,
    timingFunction TEXT
);

CREATE TABLE IF NOT EXISTS playerBets (
    horseId INTEGER,
    userId INTEGER,
    amount INTEGER,
    PRIMARY KEY (horseId, userId)
)