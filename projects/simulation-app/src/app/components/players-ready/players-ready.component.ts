import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-players-ready',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './players-ready.component.html',
  styleUrl: './players-ready.component.scss',
})
export class PlayersReadyComponent {
  public numPlayers$ = new Observable<number>();
  public numPlayersReady$ = new Observable<number>();

  constructor(private userService: UserService) {
    this.numPlayers$ = this.userService.userList.pipe(map((x) => x.length));
    this.numPlayersReady$ = this.userService.userList.pipe(
      map((users) => users.filter((u) => u.betReady).length)
    );
  }
}
