import { Pipe, PipeTransform } from '@angular/core';
import { Horse } from '../classes/horse';

@Pipe({
  name: 'orderByOdds',
  standalone: true,
})
export class OrderByOddsPipe implements PipeTransform {
  transform(horses: Horse[]): Horse[] {
    return horses.sort((a, b) => b.odds - a.odds);
  }
}
