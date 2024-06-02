import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
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
    this.userService.sendNewUser(name);
    this.inLobby = true;
  }
}
