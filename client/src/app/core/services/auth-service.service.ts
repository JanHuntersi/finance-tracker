import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {environment} from '../environments/environment';
import {Axios} from "axios";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = `${environment.API_URL}/users`;

  public authorized: boolean = false;

  public user: any = {};

  constructor(
    private http: HttpClient,
  ) {
    const user = localStorage.getItem('user');

    if (user !== null) {
      this.user = JSON.parse(user);

      this.authorized = true;
    }
  }

  public getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  public save(data: any): void {
    this.authorized = true;
    this.user = data.user;
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }

  public deleteUser(): void {
    this.authorized = false;
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  public register(username: string, email: string, password: string, passwordConfirmation: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/register`, {
      username: username,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
    });
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
