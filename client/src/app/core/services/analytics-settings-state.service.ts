import { Injectable } from '@angular/core';
import { Transaction } from "../models/Transaction";
import {BehaviorSubject} from "rxjs";
import {Category} from "../models/Category";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsSettingsStateService {
  // showLineGraph
  private showLineGraph: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showLineGraphState$ = this.showLineGraph.asObservable();

  public getShowLineGraphState(): boolean {
    return this.showLineGraph.getValue();
  }

  public toggleLineGraph(): void {
    this.showLineGraph.next(!this.showLineGraph.getValue());
  }


  // showBarGraph
  private showBarGraph: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showBarGraphState$ = this.showBarGraph.asObservable();

  public getShowBarGraphState(): boolean {
    return this.showBarGraph.getValue();
  }

  public toggleBarGraph(): void {
    this.showBarGraph.next(!this.showBarGraph.getValue());
  }


  // graphsByCategory
  private graphsByCategory: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public graphsByCategoryState$ = this.graphsByCategory.asObservable();

  public getGraphsByCategoryState(): boolean {
    return this.graphsByCategory.getValue();
  }

  public toggleGraphsByCategory(): void {
    this.graphsByCategory.next(!this.graphsByCategory.getValue());
  }


  // selectedCategories
  private selectedCategories: BehaviorSubject<Array<Category>> = new BehaviorSubject<Array<Category>>([]);
  public selectedCategoriesState$ = this.selectedCategories.asObservable();

  public getSelectedCategoriesState(): Array<Category> {
    return this.selectedCategories.getValue();
  }

  public setSelectedCategories(selectedCategories: Array<Category>): void {
    this.selectedCategories.next(selectedCategories);
  }

  public onCategorySelect(category: Category): void {
    // Get current selected categories
    const selectedCategories = this.getSelectedCategoriesState();

    // Check if category is already selected
    const categoryIndex: any = selectedCategories.findIndex((c: Category) => c.id === category.id);

    if (categoryIndex !== -1) {
      selectedCategories.splice(categoryIndex, 1); // Category exists, remove it
    } else {
      selectedCategories.push(category); // Category does not exist, add it
    }

    // Set the new selected categories
    this.setSelectedCategories(selectedCategories);
  }


  // selectedMonths
  private selectedMonths: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);
  public selectedMonthsState$ = this.selectedMonths.asObservable();

  public getSelectedMonths(): Array<number> {
    return this.selectedMonths.getValue();
  }

  public setSelectedMonths(selectedMonths: Array<number>): void {
    this.selectedMonths.next(selectedMonths);
  }

  public onMonthSelect(monthId: number): void {
    // Get current selected months
    const selectedMonths = this.getSelectedMonths();

    // Check if category is already selected
    const monthIndex: any = selectedMonths.findIndex((m: number) => m === monthId);

    if (monthIndex !== -1) {
      selectedMonths.splice(monthIndex, 1); // Month exists, remove it
    } else {
      selectedMonths.push(monthId); // Month does not exist, add it
    }

    // Set the new selected months
    this.setSelectedMonths(selectedMonths);
  }


  // selectedYear
  private selectedYear: BehaviorSubject<number> = new BehaviorSubject<number>(new Date().getFullYear());
  public selectedYearState$ = this.selectedYear.asObservable();

  public setSelectedYear(selectedYear: number): void {
    this.selectedYear.next(selectedYear);
  }

  public getSelectedYear(): number {
    return this.selectedYear.getValue();
  }
}
