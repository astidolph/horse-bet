import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Horse } from '../../classes/horse';
import { PlayerBets } from '../../classes/player-bets';
import { BettingService } from '../../services/betting.service';
import { HorseManagementService } from '../../services/horse-management.service';
import { playerNames } from '../../../assets/player-names';

@Component({
  selector: 'app-betting-panel',
  templateUrl: './betting-panel.component.html',
  styleUrls: ['./betting-panel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BettingPanelComponent {
  public players: string[] = [];
  public playerBets: PlayerBets[] = [];
  public selectedPlayersBet: PlayerBets | undefined = undefined;

  constructor(
    private horseManagementService: HorseManagementService,
    private bettingService: BettingService
  ) {
    this.players = playerNames;
    this.horseManagementService.horses.subscribe((horses) => {
      this.bettingService.createPlayerBetsModel(this.players, horses);
      this.playerBets = this.bettingService.playerBets;
      this.selectedPlayersBet = this.playerBets[0];
    });
  }

  selectPlayersBets(player: string) {
    this.selectedPlayersBet = this.playerBets.find((x) => x.player === player);
  }

  setPlayerBet(player: string | undefined, horse: Horse, bet: number) {
    if (player === undefined) return;
    this.bettingService.setPlayerBet(player, horse, bet);
  }
}
