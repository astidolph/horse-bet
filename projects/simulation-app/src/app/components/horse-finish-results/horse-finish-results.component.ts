import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Horse } from '../../classes/horse';
import { HorseManagementService } from '../../services/horse-management.service';

@Component({
  selector: 'app-horse-finish-results',
  templateUrl: './horse-finish-results.component.html',
  styleUrls: ['./horse-finish-results.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HorseFinishResultsComponent {
  results: Horse[] = [];
  staggeredResults: Horse[] = [];

  constructor(private horseManagementService: HorseManagementService) {
    this.results = this.horseManagementService.results;

    this.results.forEach((r) => {
      setTimeout(() => {
        this.staggeredResults.push(r);
      }, r.speed * 1000);
    });
  }
}
