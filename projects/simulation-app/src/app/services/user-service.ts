import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../../../../player-app/src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userList$ = new BehaviorSubject<User[]>([]);
  public gameStarted$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}

  socket = io('http://localhost:3000');

  public getNewUser = () => {
    this.socket.on('newUser', (user) => {
      const currentUsers = this.userList$.value;
      currentUsers.push(user);
      this.userList$.next(currentUsers);
    });

    return this.userList$.asObservable();
  };

  startGame() {
    console.log('game started');
    this.socket.emit('startGame');
  }

  hasGameStarted() {
    this.socket.on('gameStarted', () => {
      this.gameStarted$.next(true);
    });
    return this.gameStarted$.asObservable();
  }
}
