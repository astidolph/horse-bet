import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HorseManagementService } from './services/horse-management.service';
import { CourseComponent } from './components/course/course.component';
import { OddsPanelComponent } from './components/odds-panel/odds-panel.component';
import { BettingPanelComponent } from './components/betting-panel/betting-panel.component';
import { UserService } from './services/user-service';
import { User } from '../../../player-app/src/app/models/user';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CourseComponent,
    OddsPanelComponent,
    BettingPanelComponent,
    AsyncPipe,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('lobby', { static: true })
  lobbyDialog!: ElementRef<HTMLDialogElement>;
  userList$ = new Observable<User[]>();
  gameStarted = false;
  constructor(
    private horseManagementService: HorseManagementService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // TODO: Need to move horse generation to server-side
    this.userService.getGameState().subscribe((gameState) => {
      this.gameStarted = gameState[0].gameStarted;
      if (this.gameStarted) {
        this.horseManagementService.getHorses();
      } else {
        this.horseManagementService.generateHorses();
        this.lobbyDialog.nativeElement.showModal();
      }
    });

    this.userList$ = this.userService.getNewUser();

    this.userService
      .hasGameStarted()
      .subscribe((gameStarted) => (this.gameStarted = gameStarted));
  }

  startGame() {
    this.userService.startGame();
    this.lobbyDialog.nativeElement.close();
  }
}
