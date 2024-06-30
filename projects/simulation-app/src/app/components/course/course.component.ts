import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Horse } from '../../classes/horse';
import { HorseManagementService } from '../../services/horse-management.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('horseMove', [
      state('false', style({ left: 0 })),
      state('true', style({ left: 'calc(100% - 300px)' })),
      transition('false => true', animate('{{ speed }}s {{timingFunction}}')),
    ]),
  ],
})
export class CourseComponent {
  horses$ = new Observable<Horse[]>();
  raceStarted$ = new Observable<boolean>();
  raceFinished$ = new Observable<boolean>();
  timingFunction = '';

  constructor(private horseManagementService: HorseManagementService) {
    this.horses$ = this.horseManagementService.horses;
    this.raceStarted$ = this.horseManagementService.raceStarted;
    this.raceFinished$ = this.horseManagementService.raceFinished;
  }
}
