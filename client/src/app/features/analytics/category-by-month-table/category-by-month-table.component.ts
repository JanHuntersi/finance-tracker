import {Component, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {JsonPipe, NgForOf} from "@angular/common";
import {months} from "../../../core/config/months";
import {AnalyticsSettingsStateService} from "../../../core/services/analytics-settings-state.service";
import {Category} from "../../../core/models/Category";
import {Transaction} from "../../../core/models/Transaction";

@Component({
  selector: 'category-by-month-table',
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
    JsonPipe
  ],
  templateUrl: './category-by-month-table.component.html',
  styleUrl: './category-by-month-table.component.css'
})
export class CategoryByMonthTableComponent implements OnInit {
  @Input() public categories: Array<Category> = new Array<Category>();
  @Input() public transactions: Array<Transaction> = new Array<Transaction>();

  public data: Array<any> = [];
  public filteredData: MatTableDataSource<any> = new MatTableDataSource<any>();
  public selectedCategories: Array<Category> = new Array<Category>();
  public displayedColumns: string[] = ['category', ...months.map((_, i) => 'month_' + i)];

  public constructor(
    public analyticsSettingsStateService: AnalyticsSettingsStateService,
  ) {}

  public ngOnInit(): void {
    this.initData();

    this.subscribeToObservables();
  }

  /**
   * Initialize table data by summing up transaction amount of each month for each category
   */
  private initData(): void {
    // Add default category data
    this.categories.forEach((category: Category) => {
      this.data.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        amount: Array<number>(12).fill(0),
        show: true,
      });
    });

    // Add transaction data by month
    this.transactions.forEach((transaction: Transaction) => {
      // Get category of transaction if it exists
      const category: Category | undefined = transaction.category;

      // Get month of transaction
      const month: number = new Date(transaction.date).getMonth();

      if (category) {
        // Find the matching category in the data using the category id
        const dataCategory = this.data.find((item: any) => item.id === category.id);

        // If matching category exists, add the amount to the correct month
        if (dataCategory) {
          dataCategory.amount[month] += transaction.amount;
        }
      }
    });
  }

  /**
   * Subscribes to observables
   */
  private subscribeToObservables(): void {
    this.analyticsSettingsStateService.selectedCategoriesState$.subscribe((selectedCategories: Array<Category>) => {
      this.selectedCategories = selectedCategories;

      // If no category is selected, show all user categories
      if (this.selectedCategories.length === 0) {
        this.selectedCategories = this.categories;
      }

      this.updateShownSelectedCategories();
    })
  }

  /**
   * Update shown selected categories by filtering the ones with 'show' set to true
   */
  private updateShownSelectedCategories(): void {
    this.filteredData.data = this.data.filter((category: any) => {
      const selected = this.selectedCategories.find((selectedCategory: Category) => selectedCategory.id === category.id);
      return selected && category.show;
    })
  }

  protected readonly months = months;
}
