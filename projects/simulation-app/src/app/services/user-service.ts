import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userList$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameStarted$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}

  socket = io('http://localhost:3000');

  public getNewUser = () => {
    this.socket.on('newUser', (user) => {
      this.userList$.next(user);
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
