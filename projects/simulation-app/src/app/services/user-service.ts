import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../../../../player-app/src/app/models/user';
import { GameState } from '../classes/game-state';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userList$ = new BehaviorSubject<User[]>([]);
  public gameStarted$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

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

  getGameState(): Observable<GameState[]> {
    return this.http.get<GameState[]>(`${this.apiUrl}/api/gameState`);
  }

  hasGameStarted() {
    this.socket.on('gameStarted', () => {
      this.gameStarted$.next(true);
    });
    return this.gameStarted$.asObservable();
  }
}
