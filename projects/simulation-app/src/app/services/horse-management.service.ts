import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timeout } from 'rxjs';
import { Horse } from '../classes/horse';
import { horseNames } from '../../assets/horse-names';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

const RACE_LENGTH = 90;
const NUM_HORSES = 10;
const NUM_RANDOMISED_ODDS_PER_HORSE = 100;
const HORSE_FINISH_TIME_DIFFERENCIAL = 40;

@Injectable({
  providedIn: 'root',
})
export class HorseManagementService {
  private apiUrl = 'http://localhost:3000';
  private socket = io(this.apiUrl);

  private horses$ = new BehaviorSubject<Horse[]>([]);
  // public horses: Horse[] = [];
  private _results: Horse[] = [];
  private raceStarted$ = new BehaviorSubject<boolean>(false);
  private raceFinished$ = new BehaviorSubject<boolean>(false);
  private totalOdds = 0;
  private oddsTable: Horse[] = [];

  get horses(): Observable<Horse[]> {
    return this.horses$.asObservable();
  }

  set horses(horses: Horse[]) {
    this.horses$.next(horses);
  }

  get raceStarted(): Observable<boolean> {
    return this.raceStarted$.asObservable();
  }

  get raceFinished(): Observable<boolean> {
    return this.raceFinished$.asObservable();
  }

  setRaceStarted(val: boolean) {
    this.raceStarted$.next(val);
    setTimeout(() => this.raceFinished$.next(true), RACE_LENGTH * 1000);
  }

  get results() {
    return this._results;
  }

  constructor(private http: HttpClient) {}

  getHorses(): void {
    this.http.get<Horse[]>(`${this.apiUrl}/api/horses`).subscribe((h) => {
      this.horses = h;
      this.generateOddsTable();
    });
  }

  generateHorses(): void {
    const currentHorses = this.horses$.value;
    for (let i = 1; i < NUM_HORSES + 1; i++) {
      currentHorses.push({
        name: this.getHorseName(),
        odds: this.generateOdds(),
        percentageOdds: 0,
        fractionalOdds: '1:1',
        decimalOdds: 1.0,
        colour: this.getDistinctColour(i),
        speed: 0,
        timingFunction: this.timingFunction(),
      });
    }

    this.totalOdds = currentHorses.reduce((acc, obj) => acc + obj.odds, 0);

    currentHorses.forEach((h) => {
      h.percentageOdds = this.generatePercentageOdds(this.totalOdds, h.odds);
      h.fractionalOdds = this.generateFractionalOdds(this.totalOdds, h.odds);
      h.decimalOdds = this.generateDecimalOdds(this.totalOdds, h.odds);
    });

    this.horses = currentHorses;

    this.socket.emit('generateHorses', currentHorses);

    this.generateOddsTable();
  }

  private generatePercentageOdds(totalOdds: number, odd: number): number {
    return (odd / totalOdds) * 100;
  }

  // (1 divided by (the percentage divided by 100)) minus 1
  private generateFractionalOdds(totalOdds: number, odds: number): string {
    var equation = 1 / (this.generatePercentageOdds(totalOdds, odds) / 100) - 1;
    return `${equation.toFixed(2)}:1`;
  }

  // 1 divided by (the percentage divided by 100)
  private generateDecimalOdds(totalOdds: number, odds: number): number {
    return 1 / (this.generatePercentageOdds(totalOdds, odds) / 100);
  }

  private getHorseName(): string {
    let nameFound = false;
    let horseName = '';

    while (!nameFound) {
      let randomHorseNameIndex = Math.floor(Math.random() * horseNames.length);
      horseName = horseNames[randomHorseNameIndex];

      if (!this.horses$.value.some((x) => x.name === horseName))
        nameFound = true;
    }
    return horseName;
  }

  private generateOdds(): number {
    return Math.floor(Math.random() * NUM_RANDOMISED_ODDS_PER_HORSE + 1);
  }

  public generateResults(): void {
    // Create speed vector fastest-slowest times, each horse will be assigned speed based on finish place
    const orderedHorseSpeeds = this.speedVector();

    for (let i = 0; i < NUM_HORSES; i++) {
      // horse finished
      let horseFinishedIndex = Math.floor(Math.random() * this.totalOdds);
      let horseThatFinished = this.oddsTable[horseFinishedIndex];

      console.log(`${horseThatFinished.name} in ${i + 1} place`);

      this.setHorseSpeed(orderedHorseSpeeds[i], horseThatFinished);

      // push horse into results table
      this.results.push(horseThatFinished);

      // remove all entries of finished horse from odds table
      this.oddsTable = this.oddsTable.filter(
        (x) => x.name !== horseThatFinished.name
      );

      // adjust odds total
      this.totalOdds = this.totalOdds - horseThatFinished.odds;
    }

    this.setRaceStarted(true);
  }

  // Randomise finish times of horses between a set amount near the race length and sort by fastest-slowest
  private speedVector() {
    let speeds: number[] = [];
    for (let i = 0; i < NUM_HORSES; i++) {
      speeds.push(
        RACE_LENGTH -
          HORSE_FINISH_TIME_DIFFERENCIAL +
          Math.floor(Math.random() * HORSE_FINISH_TIME_DIFFERENCIAL)
      );
    }
    return speeds.sort((a, b) => a - b);
  }

  private getDistinctColour(colourIndex: number) {
    const colourValues: string[] = [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#000000',
      '#800000',
      '#008000',
      '#000080',
      '#808000',
      '#800080',
      '#008080',
      '#808080',
      '#C00000',
      '#00C000',
      '#0000C0',
      '#C0C000',
      '#C000C0',
      '#00C0C0',
      '#C0C0C0',
      '#400000',
      '#004000',
      '#000040',
      '#404000',
      '#400040',
      '#004040',
      '#404040',
      '#200000',
      '#002000',
      '#000020',
      '#202000',
      '#200020',
      '#002020',
      '#202020',
      '#600000',
      '#006000',
      '#000060',
      '#606000',
      '#600060',
      '#006060',
      '#606060',
      '#A00000',
      '#00A000',
      '#0000A0',
      '#A0A000',
      '#A000A0',
      '#00A0A0',
      '#A0A0A0',
      '#E00000',
      '#00E000',
      '#0000E0',
      '#E0E000',
      '#E000E0',
      '#00E0E0',
      '#E0E0E0',
    ];
    return colourValues[colourIndex];
  }

  private generateOddsTable() {
    this.horses$.value.forEach((h) => {
      for (let i = 0; i < h.odds; i++) {
        this.oddsTable.push(h);
      }
    });
    console.log('Horse odds table');
    console.log(this.oddsTable);
  }

  private setHorseSpeed(speed: number, horse: Horse): void {
    let horseFound = this.horses$.value.find((x) => x.name === horse.name);

    if (!horseFound) {
      console.log('Couldnt find the horse to give speed');
      return;
    }

    horseFound.speed = speed;
  }

  private timingFunction(): string {
    let point1 =
      0.8 + Math.random() * 0.2 * (Math.round(Math.random()) ? 1 : -1);
    let point2 =
      0.5 + Math.random() * 0.5 * (Math.round(Math.random()) ? 1 : -1);
    let point3 =
      0.6 + Math.random() * 0.1 * (Math.round(Math.random()) ? 1 : -1);
    let point4 = 1;

    return `cubic-bezier(${point1},${point2},${point3},${point4})`;
  }
}
