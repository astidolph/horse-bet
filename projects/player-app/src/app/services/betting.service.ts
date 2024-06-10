import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class BettingService {
  socket = io('http://localhost:3000');

  constructor() {}

  makeBet(playerId: number, horseId: number, amount: number): void {
    this.socket.emit('makeBet', { playerId, horseId, amount });
  }
}
