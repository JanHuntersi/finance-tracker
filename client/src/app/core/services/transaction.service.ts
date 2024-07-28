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

  public getTransactionsByMultipleCategories(categoryIds: Array<number>): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/by-category/multiple`, {categoryIds: categoryIds});
  }

  public createTransaction(transaction: Transaction): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/`, transaction);
  }

  public updateTransaction(transaction: Transaction): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  public updateCategoriesForTransactions(categoryChanges: Array<any>): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/update-categories`, {categoryChanges: categoryChanges});
  }

  public saveTransaction(transaction: Transaction): Observable<any[]> {
    return transaction.id !== undefined ? this.updateTransaction(transaction) : this.createTransaction(transaction);
  }

  public deleteTransaction(id: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }

  public deleteTransactions(ids: Array<number>): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/delete-multiple`, {'ids': ids});
  }
}
