import { Horse } from './horse';

export class PlayerBets {
  public playerId!: number;
  public bets: PlayerHorseBet[] = [];
  public winnings: number = 0;

  constructor(playerId: number, bets: PlayerHorseBet[]) {
    this.playerId = playerId;
    this.bets = bets;
  }
}

export class PlayerHorseBet {
  public horse!: Horse;
  public bet: number = 0;

  constructor(horse: Horse, bet: number) {
    this.horse = horse;
    this.bet = bet;
  }
}
