import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {environment} from '../environments/environment';
import {Axios} from "axios";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl: string = `${environment.API_URL}/transactions`;

  constructor(
    private http: HttpClient,
  ) {}

  public getTransactions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  public getTransaction(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
  }

  public login(username: string, password: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/login`, {
      username: username,
      password: password,
    });
  }

  public logout(): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/logout`, {});
  }
}
