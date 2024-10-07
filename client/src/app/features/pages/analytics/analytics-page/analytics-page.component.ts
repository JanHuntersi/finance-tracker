import {Component, OnInit} from '@angular/core';
import {SettingsComponent} from "../../../analytics/settings/settings.component";
import {InformationBoardComponent} from "../../../analytics/information-board/information-board.component";
import {TransactionService} from "../../../../core/services/transaction.service";
import {NgIf} from "@angular/common";
import {getEndOfYear, getStartOfYear} from "../../../../core/helpers/date";
import {GraphsComponent} from "../../../analytics/graphs/graphs.component";
import {Transaction} from "../../../../core/models/Transaction";
import {AnalyticsSettingsStateService} from "../../../../core/services/analytics-settings-state.service";
import {CategoryService} from "../../../../core/services/category.service";
import {Category} from "../../../../core/models/Category";

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    SettingsComponent,
    InformationBoardComponent,
    NgIf,
    GraphsComponent
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.css'
})
export class AnalyticsPageComponent implements OnInit {
  public categories: Array<Category> = new Array<Category>();
  public transactions: Array<Transaction> = new Array<Transaction>();
  public filteredTransactions: Array<Transaction> = new Array<Transaction>();
  public selectedMonths: Array<number> = new Array<number>();
  public selectedCategories: Array<Category> = new Array<Category>();
  public graphsByCategory: boolean = false;
  public loading: boolean = true;

  public constructor(
    public transactionService: TransactionService,
    public categoryService: CategoryService,
    public analyticsSettingsStateService: AnalyticsSettingsStateService,
  ) {}

  public ngOnInit() {
    // Get current year
    const currentYear: number = this.analyticsSettingsStateService.getSelectedYear();

    // By default, get transactions for the current year
    this.getTransactions(currentYear);

    this.getCategories();

    // Subscribe to the needed observables
    this.subscribeToObservables();
  }

  /**
   * Gets user transactions for the provided year
   *
   * @param { number } year
   */
  private getTransactions(year: number): void {
    // Get whole year
    const startOfYear: string = getStartOfYear(year);
    const endOfYear: string = getEndOfYear(year);

    // Get transactions for this year
    this.transactionService.getTransactionsBetweenDates(startOfYear, endOfYear).subscribe((response: any) => {
      // Save the transactions
      this.transactions = response.data.transactions;

      // By default, show all transactions
      this.filteredTransactions = this.transactions;
    })
  }

  private getCategories(): void {
    this.categoryService.getUserCategories().subscribe((response: any) => {
      // Save the categories
      this.categories = response.data.categories;

      // Transactions and categories are loaded
      this.loading = false;
    });
  }

  /**
   * Update transactions based on the selected categories and months
   */
  private updateFilteredTransactions(): void {
    const selectedCategoriesSet: Array<Category> = this.selectedCategories;
    const selectedMonthsSet: Set<number> = new Set(this.selectedMonths);

    let showAllCategories: boolean = false;
    if (selectedCategoriesSet.length === 0) {
      showAllCategories = true; // If no category is selected, show all months
    }

    let showAllMonths: boolean = false;
    if (selectedMonthsSet.size === 0) {
      showAllMonths = true; // If no month is selected, show all months
    }

    // Filter transactions based on the selected category and month
    this.filteredTransactions = this.transactions.filter((transaction: Transaction) => {
      const category = this.categories.find((c: Category) => c.id === transaction.category_id);

      const yes = category ? this.selectedCategories.some((c: Category) => c.id === category.id) : false;

      const isCategorySelected = showAllCategories || yes;

      // Is category in the correct month
      const transactionMonth: number = new Date(transaction.date).getMonth();
      const isMonthSelected = showAllMonths ? true : selectedMonthsSet.has(transactionMonth);

      return isCategorySelected && isMonthSelected;
    });
  }

  /**
   * Subscribes to observables needed for this component to show the correct data
   */
  private subscribeToObservables(): void {
    this.subscribeToSelectedYearState();
    this.subscribeToSelectedCategoriesState();
    this.subscribeToSelectedMonthsState();
    this.subscribeToGraphsByCategoryState();
  }

  /**
   * When selected year changes, get transactions for that year
   */
  private subscribeToGraphsByCategoryState(): void {
    this.analyticsSettingsStateService.graphsByCategoryState$.subscribe((graphsByCategory: boolean) => {
      this.graphsByCategory = graphsByCategory;

      this.updateFilteredTransactions();
    });
  }

  /**
   * When selected year changes, get transactions for that year
   */
  private subscribeToSelectedYearState(): void {
    this.analyticsSettingsStateService.selectedYearState$.subscribe((data: number) => {
      this.getTransactions(data);
    });
  }

  /**
   * When selected categories change, update the filtered transactions
   */
  private subscribeToSelectedCategoriesState(): void {
    this.analyticsSettingsStateService.selectedCategoriesState$.subscribe((data: Array<Category>) => {
      this.selectedCategories = data;

      // Update filtered transactions
      this.updateFilteredTransactions();
    });
  }

  /**
   * When selected months change, update the filtered transactions
   */
  private subscribeToSelectedMonthsState(): void {
    this.analyticsSettingsStateService.selectedMonthsState$.subscribe((data: Array<number>) => {
      this.selectedMonths = data;

      // Update filtered transactions
      this.updateFilteredTransactions();
    });
  }
}
