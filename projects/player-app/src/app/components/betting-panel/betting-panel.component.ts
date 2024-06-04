import { Component, OnInit } from '@angular/core';
import { HorseManagementService } from '../../services/horse-management.service';
import { CommonModule } from '@angular/common';
import { Horse } from '../../models/horse';

@Component({
  selector: 'app-betting-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './betting-panel.component.html',
  styleUrl: './betting-panel.component.scss',
})
export class BettingPanelComponent implements OnInit {
  horses: Horse[] = [];
  money = 2000;

  constructor(private horseService: HorseManagementService) {}

  ngOnInit(): void {
    this.horseService.getHorses().subscribe(
      (data) => {
        console.log(data);
        this.horses = data;
      },
      (error) => {
        console.error('Error fetching horses:', error);
      }
    );
  }

  setPlayerBet(horseId: string, bet: number) {
    // NOT IMPLEMENTED YET
  }
}
