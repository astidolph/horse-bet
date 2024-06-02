import { Injectable } from '@angular/core';
import { Horse } from '../classes/horse';
import { PlayerBets, PlayerHorseBet } from '../classes/player-bets';

@Injectable({
  providedIn: 'root'
})
export class BettingService {

  private _playerBets: PlayerBets[] = [];

  get playerBets() {
    return this._playerBets;
  }

  set playerBets(val: PlayerBets[]) {
    this._playerBets = val;
  }

  constructor() { }

  createPlayerBetsModel(players: string[], horses: Horse[]) {
    this.playerBets = players.map(x => new PlayerBets(x, horses.map(x => new PlayerHorseBet(x, 0))));
  }

  setPlayerBet(player: string, horse: Horse, bet: number) {
    let foundPlayersBets = this.playerBets.find(x => x.player === player)?.bets;

    if (foundPlayersBets === undefined) {
      console.log(`Player ${player} tried to bet ${bet} on ${horse}: Couldn't find players bets`);
      return;
    }

    let horseToBetOn = foundPlayersBets.find(x => x.horse.name === horse.name);

    if (horseToBetOn === undefined) {
      console.log(`Player ${player} tried to bet ${bet} on ${horse}: Couldn't find players horse to bet on`);
      return;
    }
    
    horseToBetOn.bet = bet;
  }
}
