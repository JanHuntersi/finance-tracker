import {Component, model, OnInit} from '@angular/core';
import {
  TransactionsByCategoryGraphComponent
} from "../../../../shared/components/graphs/expenses-by-category/transactions-by-category-graph.component";
import {CategoryService} from "../../../../core/services/category.service";
import {TransactionService} from "../../../../core/services/transaction.service";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {SearchBarComponent} from "../../../../core/components/header/search-bar/search-bar.component";
import {TransactionListComponent} from "../../../transactions/transaction-list/transaction-list.component";
import {
  CompactTransactionListComponent
} from "../../../transactions/compact-transaction-list/compact-transaction-list.component";
import {CategoryListComponent} from "../../../categories/category-list/category-list.component";
import {CategoryBudgetList} from "../../../categories/category-budget-list/category-budget-list.component";
import {
  SpendingByDateComponent
} from "../../../../shared/components/graphs/spending-by-date/spending-by-date.component";
import {MonthNamePipe} from "../../../../core/pipes/month-name.pipe";
import {getEndOfMonth, getStartOfMonth, formatDate} from "../../../../core/helpers/date";
import {BudgetService} from "../../../../core/services/budget.service";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    TransactionsByCategoryGraphComponent,
    NgIf,
    MatIcon,
    SearchBarComponent,
    TransactionListComponent,
    CompactTransactionListComponent,
    CategoryListComponent,
    CategoryBudgetList,
    SpendingByDateComponent,
    MonthNamePipe
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  public budget: Array<any> = new Array<any>();
  public budgetInformation: any = {
    'allocated': [],
    'spent': [],
    'left': [],
  };
  public transactions: Array<any> = new Array<any>();
  public categories: Array<any> = new Array<any>();
  public selectedCategories: Array<any> = new Array<any>();
  public filteredTransactions: Array<any> = new Array<any>();
  public currentMonth: number = new Date().getMonth();
  public currentYear: number = new Date().getFullYear();
  public settings: boolean = false;

  public constructor(
    public budgetService: BudgetService,
    public categoryService: CategoryService,
    public transactionService: TransactionService,
  ) {}

  public ngOnInit() {
    this.getBudget();
  }

  /**
   * Get user budget and filter it for this month
   */
  public getBudget(): void {
    this.budgetService.getUserBudget().subscribe({
      next: (response: any) => {
        this.budget = response.data.budget;

        this.filterBudget();
        this.getBudgetSpending();
        this.getCategories();
      }
    })
  }

  public resetBudgetInformation(): void {
    this.budgetInformation = {
      'allocated': [],
      'spent': [],
      'left': [],
    };
  }

  /**
   * Filter the budget, so it only shows budget of this month
   */
  public filterBudget(): void {
    // Prepare budget for compact category list
    this.budget.forEach((budget: any) => {
      if (budget['month'] === this.currentMonth) {
        this.budgetInformation['allocated'][budget['category_id']] = budget['amount'];
      }
    });
  }

  public getBudgetSpending(): void {
    // Prepare budget for compact category list
    this.filteredTransactions.forEach((transaction: any) => {
      if (this.budgetInformation['spent'][transaction['category_id']]) {
        this.budgetInformation['spent'][transaction['category_id']] += transaction['amount'];
      } else {
        this.budgetInformation['spent'][transaction['category_id']] = transaction['amount'];
      }
    });
  }

  public getBudgetLeftAmount(): void {
    this.budgetInformation['allocated'].forEach((allocated: any, index: number) => {
      const spent: number = this.budgetInformation['spent'][index] ?? 0;

      // Calculate how much the user has left for each category
      this.budgetInformation['left'][index] = allocated - spent;
    });
  }

  /**
   * Gets transactions for current month
   */
  public getTransactions(): void {
    const fromDate: Date = getStartOfMonth(this.currentYear, this.currentMonth);
    const toDate: Date = getEndOfMonth(this.currentYear, this.currentMonth);

    const fromDateFormatted: string = formatDate(fromDate);
    const toDateFormatted: string = formatDate(toDate);

    this.transactionService.getTransactionsBetweenDates(fromDateFormatted, toDateFormatted).subscribe({
      next: (response: any) => {
        this.transactions = response.data.transactions;
        this.updateDateRange();

        // Reset budget information by setting all values back to 0
        this.resetBudgetInformation();

        // Filter the budget for next month
        this.filterBudget();

        // Get budget spending for next month
        this.getBudgetSpending();

        this.getBudgetLeftAmount();
      }
    })
  }

  /**
   * Gets user categories
   */
  public getCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;

        this.getTransactions();
      }
    })
  }

  /**
   * Toggles settings view
   */
  public toggleSettings(): void {
    this.settings = !this.settings;
  }

  /**
   * Moves to next month and updates transactions
   */
  public goToNextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }

    // Reset month data for next month
    this.resetMonthData();
  }

  /**
   * Moves to previous month and updates transactions
   */
  public goToPreviousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }

    // Reset month data for previous month
    this.resetMonthData();
  }

  public resetMonthData(): void {
    // Get transactions for next month
    this.getTransactions();
  }

  /**
   * User clicked on a category, so we need to add/remove to/from the list
   *
   * @param { any } category
   */
  public onCategorySelect(category: any): void {
    // Check if category with this id is already selected
    const categoryIndex: any = this.selectedCategories.findIndex(c => c.id === category.id);

    if (categoryIndex !== -1) {
      // Category exists, remove it
      this.selectedCategories.splice(categoryIndex, 1);
    } else {
      // Category does not exist, add it
      this.selectedCategories.push(category);
    }

    this.updateTransactionsWithSelectedCategories();
  }

  /**
   * Update transactions based on the selected categories
   */
  public updateTransactionsWithSelectedCategories(): void {
    // Convert selectedCategories to a Set for efficient lookups
    const selectedCategoryIds: Set<number> = new Set(this.selectedCategories.map(c => c.id));

    if (selectedCategoryIds.size == 0) {
      this.filteredTransactions = this.transactions;
    } else {
      // Filter transactions based on selected categories
      this.filteredTransactions = this.transactions.filter((transaction: any) => {
        return selectedCategoryIds.has(transaction.category_id);
      });
    }
  }

  /**
   * Update date range based on the current month and year
   */
  private updateDateRange(): void {
    const startDate: Date = getStartOfMonth(this.currentYear, this.currentMonth);
    const endDate: Date = getEndOfMonth(this.currentYear, this.currentMonth);

    // Update transactions based on the date range
    this.onDateRangeChange({ startDate, endDate });
  }

  /**
   * When date range changes, filter the transactions based on the changed date range, so info on page updates
   *
   * @param { any } event
   */
  public onDateRangeChange(event: any): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate: Date = new Date(transaction.date);

      // If transaction is between the date, return it
      return transactionDate >= event.startDate && transactionDate <= event.endDate;
    });
  }

  protected readonly model = model;
}
