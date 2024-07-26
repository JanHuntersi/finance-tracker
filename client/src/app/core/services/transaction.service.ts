import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {environment} from '../environments/environment';
import {Axios} from "axios";
import {Transaction} from "../models/Transaction";

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

  public createTransaction(transaction: Transaction): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/`, transaction);
  }

  public updateTransaction(transaction: Transaction): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  public saveTransaction(transaction: Transaction): Observable<any[]> {
    return transaction.id !== undefined ? this.updateTransaction(transaction) : this.createTransaction(transaction);
  }

  public deleteTransaction(id: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}
