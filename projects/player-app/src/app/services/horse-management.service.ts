import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horse } from '../models/horse';

@Injectable({
  providedIn: 'root',
})
export class HorseManagementService {
  private apiUrl = 'http://localhost:3000/api/horses';

  constructor(private http: HttpClient) {}

  getHorses(): Observable<Horse[]> {
    return this.http.get<Horse[]>(this.apiUrl);
  }
}
