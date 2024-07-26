import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {environment} from '../environments/environment';
import {Axios} from "axios";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string = `${environment.API_URL}/categories`;

  constructor(
    private http: HttpClient,
  ) {}

  public getUserCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }
}
