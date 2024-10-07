import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell, MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf} from "@angular/common";
import {months} from "../../../core/config/months";
import {MonthNamePipe} from "../../../core/pipes/month-name.pipe";
import {categorizeBudgetByType} from "../../../core/helpers/transactions";
import {Transaction} from "../../../core/models/Transaction";
import {AnalyticsSettingsStateService} from "../../../core/services/analytics-settings-state.service";
import {Category} from "../../../core/models/Category";

@Component({
  selector: 'information-board',
  standalone: true,
  imports: [
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatFooterCellDef,
    NgForOf,
    MonthNamePipe,
    NgClass
  ],
  templateUrl: './information-board.component.html',
  styleUrl: './information-board.component.css'
})
export class InformationBoardComponent implements OnInit, OnChanges {
  @Input() public categories: Array<Category> = new Array<Category>();
  @Input() public transactions: Array<Transaction> = new Array<Transaction>();

  public incomes: Array<Transaction> = new Array<Transaction>();
  public expenses: Array<Transaction> = new Array<Transaction>();
  public savings: Array<Transaction> = new Array<Transaction>();
  public monthIncomesTotals: Array<number> = new Array<number>(12).fill(0);
  public monthExpensesTotals: Array<number> = new Array<number>(12).fill(0);
  public monthSavingsTotals: Array<number> = new Array<number>(12).fill(0);
  public incomesTotal: number = 0;
  public expensesTotal: number = 0;
  public savingsTotal: number = 0;
  public selectedMonths: Array<number> = new Array<number>();
  public selectedYear: number = new Date().getFullYear();
  public selectedTypes: Array<number> = new Array<number>();
  public displayedColumns: string[] = ['month', 'incomes', 'expenses', 'savings'];
  public data: Array<any> = new Array<any>();

  public constructor(
    public analyticsSettingsStateService: AnalyticsSettingsStateService
  ) {}

  public ngOnInit() {
    this.prepareData();
    this.subscribeToObservables();
  }

  /**
   * Prepares data for the component
   */
  private prepareData(): void {
    this.clearData();
    this.categorizeBudgetByType();
    this.calculateTotals();
    this.prepareTableData();
  }

  /**
   * Reset component data back to its default values
   */
  public clearData(): void {
    // Clear totals
    this.incomesTotal = 0;
    this.expensesTotal = 0;
    this.savingsTotal = 0;

    // Clear categories
    this.incomes = new Array<Transaction>();
    this.expenses = new Array<Transaction>();
    this.savings = new Array<Transaction>();

    // Clear month totals
    this.monthIncomesTotals = new Array<number>(12).fill(0);
    this.monthExpensesTotals = new Array<number>(12).fill(0);
    this.monthSavingsTotals = new Array<number>(12).fill(0);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions']) {
      this.prepareData();
    }
  }

  /**
   * Filter the transactions to reflect the selected type
   *
   * @param { number } typeId
   */
  protected onTypeSelect(typeId: number): void {
    let typedCategories: Array<Category> = [];

    // Update selectedTypes
    this.updateSelectedTypes(typeId);

    /**
     * Select categories based on the selected types
     */
    if (this.selectedTypes.length === 1) {
      // Get the selected type
      const selectedTypeId: number = this.selectedTypes[0];

      typedCategories = this.categories.filter((category: Category) => category.type_id === selectedTypeId);
    } else if (this.selectedTypes.length === 2) {
      typedCategories = this.categories.filter((category: Category) => this.selectedTypes.includes(category.type_id));
    } else {
      this.selectedTypes = [];
    }

    // Set the typed categories
    this.analyticsSettingsStateService.setSelectedCategories(typedCategories);
  }

  /**
   * Update selectedTypes array based on if the type is present or not
   *
   * @param { number } typeId
   */
  private updateSelectedTypes(typeId: number): void {
    // Check if category is already selected
    const typeIndex: any = this.selectedTypes.findIndex((t: number) => t === typeId);

    if (typeIndex !== -1) {
      this.selectedTypes.splice(typeIndex, 1); // Month exists, remove it
    } else {
      this.selectedTypes.push(typeId); // Month does not exist, add it
    }
  }

  /**
   * Categorizes budget by type, and returns separate arrays
   */
  private categorizeBudgetByType(): void {
    // Categorize budget by type
    const { expenses, incomes, savings } = categorizeBudgetByType(this.transactions);

    // Set categorized budget
    this.expenses = expenses;
    this.incomes = incomes;
    this.savings = savings;
  }

  /**
   * Calculates monthly and yearly totals of all types
   */
  private calculateTotals(): void {
    this.incomesTotal = this.calculateCategoryTotal(this.incomes, this.monthIncomesTotals, this.incomesTotal);
    this.expensesTotal = this.calculateCategoryTotal(this.expenses, this.monthExpensesTotals, this.expensesTotal);
    this.savingsTotal = this.calculateCategoryTotal(this.savings, this.monthSavingsTotals, this.savingsTotal);
  }

  /**
   * Calculates totals for the given transaction category
   *
   * @param { Array<Transaction> } transactions
   * @param { Array<number> } monthTotals
   * @param { number } total
   */
  private calculateCategoryTotal(transactions: Array<Transaction>, monthTotals: Array<number>, total: number): number {
    transactions.forEach((transaction: Transaction) => {
      // Get date of the current income entry
      let date: Date = new Date(transaction.date);

      // Get month of the transaction
      let month: number = date.getMonth();

      // Add to totals
      monthTotals[month] += transaction.amount;
      total += transaction.amount;
    });

    return total;
  }

  /**
   * Prepares data for the table rows.
   */
  private prepareTableData(): void {
    this.data = months.map((month, index) => ({
      month: month,
      incomes: this.monthIncomesTotals[index],
      expenses: this.monthExpensesTotals[index],
      savings: this.monthSavingsTotals[index]
    }));
  }

  /**
   * User clicked on a month, so we need to add/remove to/from the list
   *
   * @param { number } monthId
   */
  protected onMonthSelect(monthId: number): void {
    this.analyticsSettingsStateService.onMonthSelect(monthId);
  }

  /**
   * Checks if the current month is already selected
   *
   * @param { number } month
   */
  protected isMonthSelected(month: number): boolean {
    return this.selectedMonths.findIndex((m: number) => m === month) !== -1;
  }

  /**
   * Checks if the current month is already selected
   *
   * @param { number } typeId
   */
  protected isTypeSelected(typeId: number): boolean {
    return this.selectedTypes.findIndex((m: number) => m === typeId) !== -1;
  }

  /**
   * Decrement year by 1
   */
  protected goToPreviousYear(): void {
    this.analyticsSettingsStateService.setSelectedYear(--this.selectedYear);
  }

  /**
   * Increment year by 1
   */
  protected goToNextYear(): void {
    this.analyticsSettingsStateService.setSelectedYear(++this.selectedYear);
  }

  /**
   * Subscribes to observables needed for this component to show the correct data
   */
  private subscribeToObservables(): void {
   this.subscribeToSelectedMonthsState();
   this.subscribeToSelectedYearState();
  }

  /**
   * When selected months change, update the information board
   */
  private subscribeToSelectedMonthsState(): void {
    this.analyticsSettingsStateService.selectedMonthsState$.subscribe((selectedMonths: Array<number>) => {
      this.selectedMonths = selectedMonths;
    });
  }

  /**
   * When selected year changes, get transactions for that year
   */
  private subscribeToSelectedYearState(): void {
    this.analyticsSettingsStateService.selectedYearState$.subscribe((selectedYear: number) => {
      this.selectedYear = selectedYear;
    });
  }

  protected readonly months = months;
}
