import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HorseManagementService } from './services/horse-management.service';
import { UserService } from './services/user-service';
import { CourseComponent } from './components/course/course.component';
import { OddsPanelComponent } from './components/odds-panel/odds-panel.component';
import { BettingPanelComponent } from './components/betting-panel/betting-panel.component';

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
  userList: string[] = [];
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

    this.userService.getNewUser().subscribe((message: string) => {
      this.userList.push(message);
    });

    this.userService
      .hasGameStarted()
      .subscribe((gameStarted) => (this.gameStarted = gameStarted));

    // MIMIC THE USER OF PHONE TO ADD NEW USERS
    this.userService.sendNewUser('fakeUser1');
    this.userService.sendNewUser('fakeUser2');
    this.userService.sendNewUser('fakeUser3');
  }

  startGame() {
    this.userService.startGame();
    this.lobbyDialog.nativeElement.close();
  }
}
