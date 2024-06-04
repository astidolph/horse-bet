import { Component, OnInit } from '@angular/core';
import { HorseManagementService } from '../../services/horse-management.service';

@Component({
  selector: 'app-betting-panel',
  standalone: true,
  imports: [],
  templateUrl: './betting-panel.component.html',
  styleUrl: './betting-panel.component.scss',
})
export class BettingPanelComponent implements OnInit {
  horses: any[] = [];

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
}
