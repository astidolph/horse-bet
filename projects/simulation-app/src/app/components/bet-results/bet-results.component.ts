import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Horse } from '../../classes/horse';
import { PlayerBets, PlayerHorseBet } from '../../classes/player-bets';
import { BettingService } from '../../services/betting.service';
import { HorseManagementService } from '../../services/horse-management.service';

@Component({
  selector: 'app-bet-results',
  templateUrl: './bet-results.component.html',
  styleUrls: ['./bet-results.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BetResultsComponent {
  public playerBets: PlayerBets[] = [];
  public winningHorses: Horse[] = [];
  // private stakeSplit = 1;
  public raceFinished$ = new Observable<boolean>();

  constructor(
    private bettingService: BettingService,
    private horseManagementService: HorseManagementService
  ) {
    this.raceFinished$ = this.horseManagementService.raceFinished;
    this.playerBets = this.bettingService.playerBets;
    // let topHorseSpeed = this.horseManagementService.results
    //   .map((x) => x.speed)
    //   .reduce((accumulatedValue, currentValue) =>
    //     Math.min(accumulatedValue, currentValue)
    //   );
    // this.winningHorses = this.horseManagementService.results.filter(
    //   (x) => x.speed === topHorseSpeed
    // );
    // this.stakeSplit = this.winningHorses.length;
    // console.log(
    //   'Winning horse(s): ' + this.winningHorses + ' in ' + topHorseSpeed
    // );

    // this.playerBets.forEach(
    //   (x) => (x.winnings = this.calculateWinnings(x.bets))
    // );
  }

  public sumPlayerBets(bets: PlayerHorseBet[]) {
    if (bets.length === 0) return;
    return bets.map((x) => x.bet).reduce((acc, val) => acc + val);
  }

  public getHorsesBetOn(playerBets: PlayerBets): PlayerHorseBet[] {
    return playerBets.bets.filter((x) => x.bet != 0);
  }

  // public calculateWinnings(playerBets: PlayerHorseBet[]): number {
  //   var totalBet: number = playerBets.reduce((acc, val) => acc + val.bet, 0);

  //   var betsOnWinningHorses = playerBets
  //     .filter((x) => this.winningHorses.includes(x.horse))
  //     .filter((x) => x.bet > 0);

  //   if (betsOnWinningHorses.length === 0) {
  //     return -totalBet;
  //   } else {
  //     let totalWinnings = betsOnWinningHorses.reduce(
  //       (acc, val) =>
  //         acc + (val.bet * (val.horse.decimalOdds - 1)) / this.stakeSplit,
  //       0
  //     );
  //     return totalWinnings - totalBet;
  //   }
  // }
}
