import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Horse } from '../../classes/horse';
import { OrderByOddsPipe } from '../../pipes/orderByPipe';
import { HorseManagementService } from '../../services/horse-management.service';
import { BetResultsComponent } from '../bet-results/bet-results.component';
import { HorseFinishResultsComponent } from '../horse-finish-results/horse-finish-results.component';
import { PlayersReadyComponent } from '../players-ready/players-ready.component';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-odds-panel',
  templateUrl: './odds-panel.component.html',
  styleUrls: ['./odds-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    OrderByOddsPipe,
    BetResultsComponent,
    HorseFinishResultsComponent,
    PlayersReadyComponent,
  ],
})
export class OddsPanelComponent {
  horses$ = new Observable<Horse[]>();
  raceStarted = new Observable<boolean>();

  constructor(
    private horseManagementService: HorseManagementService,
    public userService: UserService
  ) {
    this.horses$ = this.horseManagementService.horses;
    this.raceStarted = this.horseManagementService.raceStarted;
  }

  public startRace() {
    this.horseManagementService.generateResults();
  }
}
