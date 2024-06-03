# HorseBet

Project built as a bit of fun attempting to mimic how Jackbox party games operate. It is a virtual horse racing game where horses are randomly generated with names and odds each round, players are given a pot of money they can use to make bets.

There are three parts to this application:

1. `simulation-app` the host application that runs the horse racing simulation.
2. `player-app` the application that players of the game will use in order to make bets on horses and view their money.
3. `server` using `socket.io` to provide real-time state changes between the `player-app` and `simulation-app` along with SQLITE for storage.

## Getting up and running

### Running the simulation

Run `npm run start` which will run the `simulation-app` on `localhost:4200`. The application will automatically reload if you change any of the source files.

If you simply want to use the simulation you can run this app alone by starting the game without players.

### Running the server

Run `npm run server` you should receive a message `listening on port 3000`.

### Running the player app

Run `npm run start:playerApp` which will run the `player-app` on `localhost:4201`. The application will automatically reload if you change any of the source files.

The player app will require the server to be ran otherwise this application will not be very useful.
