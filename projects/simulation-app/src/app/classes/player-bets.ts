import { Horse } from './horse';

export class PlayerBets {
  public playerId!: number;
  public playerName!: string;
  public bets: PlayerHorseBet[] = [];
  public winnings: number = 0;

  constructor(playerId: number, playerName: string, bets: PlayerHorseBet[]) {
    this.playerId = playerId;
    this.playerName = playerName;
    this.bets = bets;
  }
}

export class PlayerHorseBet {
  public horse: Horse;
  public bet: number = 0;

  constructor(horse: Horse, bet: number) {
    this.horse = horse;
    this.bet = bet;
  }
}

export class FlatPlayerHorseBet {
  public horseId!: string;
  public playerId!: number;
  public amount: number = 0;
}
