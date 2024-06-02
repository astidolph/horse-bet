import { Horse } from "./horse";

export class PlayerBets {
    public player!: string;
    public bets: PlayerHorseBet[] = [];
    public winnings: number = 0;

    constructor(player: string, bets: PlayerHorseBet[]) {
        this.player = player;
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