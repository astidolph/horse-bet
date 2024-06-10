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
  money = 2000;

  constructor(
    private horseService: HorseManagementService,
    private bettingService: BettingService
  ) {}

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
    this.bettingService.makeBet(1, horseId, amount);
    const horse = this.horses.find((h) => h.id === horseId);
    if (horse) {
      horse.betAmount = amount;
    } else {
      console.error(`Horse with id ${horseId} not found.`);
    }
  }
}
