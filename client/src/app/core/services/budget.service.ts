import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl: string = `${environment.API_URL}/budgets`;

  constructor(
    private http: HttpClient,
  ) {}

  public getUserBudget(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  public createBudget(budget: any, advanced: boolean = false): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}`, {
      'budget': budget,
      'advanced': advanced,
    });
  }

  public updateBudget(budget: any, advanced: boolean = false, id: number): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/${id}`, {
      'budget': budget,
      'advanced': advanced,
    });
  }

  public saveBudget(budget: any, advanced: boolean = false, editing: boolean = false, id: number): Observable<any[]> {
    return editing ? this.updateBudget(budget, advanced, id) : this.createBudget(budget, advanced);
  }
}
