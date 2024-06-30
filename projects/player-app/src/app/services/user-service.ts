import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { GameState } from '../models/game-state';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

  public userList$ = new BehaviorSubject<User[]>([]);
  public gameStarted$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  public sendNewUser(newUser: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/api/users`,
      { name: newUser },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  startGame() {
    console.log('game started');
    this.socket.emit('startGame');
  }

  getGameState(): Observable<GameState[]> {
    return this.http.get<GameState[]>(`${this.apiUrl}/api/gameState`);
  }

  hasGameStarted(): Observable<boolean> {
    this.socket.on('gameStarted', () => {
      this.gameStarted$.next(true);
    });
    return this.gameStarted$.asObservable();
  }
}
