import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user-service';
import { BettingPanelComponent } from './components/betting-panel/betting-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, BettingPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  name = '';
  inLobby = false;
  gameStarted = false;
  constructor(private userService: UserService) {
    this.userService
      .hasGameStarted()
      .subscribe((gameStarted) => (this.gameStarted = gameStarted));
  }
  submit(name: string) {
    if (!name) return;
    this.userService.sendNewUser(name).subscribe((user) => {
      localStorage.setItem('userId', user.id?.toString() ?? '');
      localStorage.setItem('userName', user.name);
    });

    this.inLobby = true;
  }
}
