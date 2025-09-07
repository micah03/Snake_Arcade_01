import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  name: string;
  email?: string;
  highScore: number;
}

export interface Score {
  userId: string;
  score: number;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/leaderboard`);
  }

  submitScore(score: Score): Observable<Score> {
    return this.http.post<Score>(`${this.apiUrl}/scores`, score);
  }

  sendInvite(email: string, playerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/invite`, { email, playerName });
  }
}