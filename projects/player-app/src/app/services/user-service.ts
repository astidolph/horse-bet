import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  public userList$ = new BehaviorSubject<User[]>([]);
  public gameStarted$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  socket = io('http://localhost:3000');

  public sendNewUser(newUser: string): Observable<User> {
    return this.http.post<User>(
      this.apiUrl,
      { name: newUser },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

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
