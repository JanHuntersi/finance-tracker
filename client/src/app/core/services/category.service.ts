import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../environments/environment';
import { Category } from "../models/Category";

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

  public getSavingsCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-savings`);
  }

  public deleteCategory(id: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }

  public deleteCategories(ids: Array<number>): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/delete-multiple`, {'ids': ids});
  }

  public createCategory(category: Category): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/`, category);
  }

  public updateCategory(category: Category): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/${category.id}`, category);
  }

  public saveCategory(category: Category): Observable<any[]> {
    return category.id !== undefined ? this.updateCategory(category) : this.createCategory(category);
  }

  public updateGoal(goal: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/saving-goals/${goal.id}`, goal);
  }
}
