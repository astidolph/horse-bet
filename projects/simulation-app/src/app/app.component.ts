import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HorseManagementService } from './services/horse-management.service';
import { CourseComponent } from './components/course/course.component';
import { OddsPanelComponent } from './components/odds-panel/odds-panel.component';
import { BettingPanelComponent } from './components/betting-panel/betting-panel.component';
import { UserService } from './services/user-service';
import { User } from '../../../player-app/src/app/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CourseComponent, OddsPanelComponent, BettingPanelComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('lobby', { static: true })
  lobbyDialog!: ElementRef<HTMLDialogElement>;
  newUser = '';
  userList: User[] = [];
  userJoined = false;
  gameStarted = false;
  constructor(
    private horseManagementService: HorseManagementService,
    private userService: UserService
  ) {
    this.horseManagementService.generateHorses();
  }
  ngOnInit() {
    this.lobbyDialog.nativeElement.showModal();

    this.userService.getNewUser().subscribe((users: User[]) => {
      this.userList = users;
    });

    this.userService
      .hasGameStarted()
      .subscribe((gameStarted) => (this.gameStarted = gameStarted));
  }

  startGame() {
    this.userService.startGame();
    this.lobbyDialog.nativeElement.close();
  }
}
