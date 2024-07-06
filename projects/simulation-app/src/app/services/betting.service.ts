import { Injectable } from '@angular/core';
import { Horse } from '../classes/horse';
import {
  FlatPlayerHorseBet,
  PlayerBets,
  PlayerHorseBet,
} from '../classes/player-bets';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable, ObservedValueOf } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BettingService {
  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

  private flatPlayerBets$ = new BehaviorSubject<FlatPlayerHorseBet[]>([]);
  private playerBets$ = new BehaviorSubject<PlayerBets[]>([]);

  get playerBets(): Observable<PlayerBets[]> {
    return this.playerBets$.asObservable();
  }

  set playerBets(val: PlayerBets[]) {
    this.playerBets$.next(val);
  }

  constructor() {}

  public newBetListener = () => {
    // Since you can only make bets once we don't have to check for any modifications we just set all bets
    this.socket.on('betMade', (playerBet: FlatPlayerHorseBet) => {
      const { horseId, playerId, amount } = playerBet;
      const currentPlayerBets = this.flatPlayerBets$.value;
      this.flatPlayerBets$.next([
        ...currentPlayerBets,
        { horseId, playerId, amount },
      ]);
    });
  };
}
