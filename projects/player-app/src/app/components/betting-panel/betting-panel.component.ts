import { Component, OnInit } from '@angular/core';
import { HorseManagementService } from '../../services/horse-management.service';
import { CommonModule } from '@angular/common';
import { Horse } from '../../models/horse';
import { BettingService } from '../../services/betting.service';
import { HorseWithBet } from '../../models/player-bet';

@Component({
  selector: 'app-betting-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './betting-panel.component.html',
  styleUrl: './betting-panel.component.scss',
})
export class BettingPanelComponent implements OnInit {
  horses: HorseWithBet[] = [];
  money = 1000;
  playerId!: number;
  playerName: string | null = null;
  betMade = false;

  constructor(
    private horseService: HorseManagementService,
    private bettingService: BettingService
  ) {
    const userId = localStorage.getItem('userId');
    if (userId !== null) {
      this.playerId = parseInt(userId);
    }
    console.log(userId);

    const userName = localStorage.getItem('userName');
    this.playerName = userName;
    console.log(userName);
  }

  ngOnInit(): void {
    this.horseService.getHorses().subscribe(
      (horses) => {
        console.log(horses);
        this.horses = horses.map((h) => ({ ...h, betAmount: 0 }));
      },
      (error) => {
        console.error('Error fetching horses:', error);
      }
    );
  }

  setPlayerBet(horseId: number, amount: number) {
    const moneyAfterBet = this.moneyAfterBet(horseId, amount);
    if (moneyAfterBet < 0) {
      console.log(
        `${this.playerId} bet amount: ${amount} but could not afford it!`
      );
      return;
    }

    console.log(
      `${this.playerId} bet amount: ${amount} current money: ${this.money}`
    );

    this.money = moneyAfterBet;
    const horse = this.horses.find((h) => h.id === horseId);
    if (horse) {
      horse.betAmount = amount;
    } else {
      console.error(`Horse with id ${horseId} not found.`);
    }
  }

  private moneyAfterBet(horseId: number, amount: number): number {
    const currentHorseBet = this.horses.find(
      (h) => h.id === horseId
    )?.betAmount;
    return this.money - amount + (currentHorseBet ?? 0);
  }

  makeBet(): void {
    this.betMade = true;
    this.horses
      .filter((h) => h.betAmount > 0)
      .forEach((h) =>
        this.bettingService.makeBet(this.playerId, h.id, h.betAmount)
      );
  }
}
