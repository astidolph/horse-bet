import { Injectable } from '@angular/core';
import { Horse } from '../classes/horse';
import {
  FlatPlayerHorseBet,
  PlayerBets,
  PlayerHorseBet,
} from '../classes/player-bets';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable, ObservedValueOf } from 'rxjs';
import { HorseManagementService } from './horse-management.service';

@Injectable({
  providedIn: 'root',
})
export class BettingService {
  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

  private playerBets$ = new BehaviorSubject<PlayerBets[]>([]);
  private playerBetsMap: Map<number, PlayerHorseBet[]> = new Map();

  get playerBets(): Observable<PlayerBets[]> {
    return this.playerBets$.asObservable();
  }

  set playerBets(val: PlayerBets[]) {
    this.playerBets$.next(val);
  }

  constructor(private horseManagementService: HorseManagementService) {}

  public newBetListener = () => {
    // Since you can only make bets once we don't have to check for any modifications we just set all bets for the player
    this.socket.on('betMade', (playerBet: FlatPlayerHorseBet) => {
      // Revisit this setting bet in a map and then converting the model not good
      const { horseId, amount, playerId } = playerBet;

      // Try to find horse bet on
      const horseFound = this.horseManagementService.getHorseById(horseId);

      if (!horseFound) {
        console.log(
          `Bet received from player ${playerId} but horse ${horseId} not found`
        );
      }

      // Check if player has made a bet previously
      if (!this.playerBetsMap.has(playerId)) {
        this.playerBetsMap.set(playerId, []);
      }

      const horseBetsMap = this.playerBetsMap.get(playerId);

      if (!horseBetsMap) return;

      horseBetsMap.push({ horse: horseFound!, bet: amount });
      this.playerBetsMap.set(playerId, horseBetsMap);

      // Convert to the correct model
      const playerBetsArray: PlayerBets[] = [];

      this.playerBetsMap.forEach((horseBetsMap, playerId) => {
        const playerBets = new PlayerBets(playerId, []);
        horseBetsMap.forEach((horseBet) => {
          playerBets.bets.push(horseBet);
        });
        playerBetsArray.push(playerBets);
      });

      this.playerBets$.next(playerBetsArray);
    });
  };
}
