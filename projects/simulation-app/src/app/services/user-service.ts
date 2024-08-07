import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { GameState } from '../classes/game-state';
import { HttpClient } from '@angular/common/http';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

  private userList$ = new BehaviorSubject<User[]>([]);
  public gameStarted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get userList(): Observable<User[]> {
    return this.userList$.asObservable();
  }

  set userList(users: User[]) {
    this.userList$.next(users);
  }

  setPlayerMadeBet(playerId: number) {
    const currentUserList = this.userList$.value;
    const currentUser = currentUserList.find((x) => x.id === playerId);
    if (!currentUser) return;
    currentUser.betReady = true;
    this.userList = currentUserList;
  }

  getUserById(userId: number) {
    return this.userList$.value.find((x) => x.id === userId);
  }

  constructor(private http: HttpClient) {
    localStorage.clear();
    let users = localStorage.getItem('users');
    if (users) {
      let parsedUsers = JSON.parse(users);
      this.userList$.next(parsedUsers);
    }
  }

  public newUserListener = () => {
    this.socket.on('newUser', (user) => {
      const currentUsers = this.userList$.value;
      currentUsers.push(user);
      this.userList = currentUsers;
      localStorage.setItem(
        'users',
        JSON.stringify([...this.userList$.value, user])
      );
    });
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
