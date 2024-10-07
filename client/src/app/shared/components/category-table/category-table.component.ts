import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {Category} from "../../../core/models/Category";
import {CategoryService} from "../../../core/services/category.service";
import {AnalyticsSettingsStateService} from "../../../core/services/analytics-settings-state.service";
import {JsonPipe, NgClass} from "@angular/common";
import {getClassBasedOnType} from "../../../core/helpers/mapper";

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    MatTable,
    MatIcon,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    NgClass,
    JsonPipe
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent implements OnInit {
  @Input() public data: any = {};
  @Input() public selectedType: string = "expenses";

  @Output() public categoryEmitter: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  public selectedCategories: Array<Category> = new Array<Category>();

  public displayedColumns: string[] = ['category'];

  public constructor(
    public analyticsSettingsStateService: AnalyticsSettingsStateService
  ) {}

  public ngOnInit() {
    this.analyticsSettingsStateService.selectedCategoriesState$.subscribe((selectedCategories: Array<Category>) => {
      this.selectedCategories = selectedCategories;
    });
  }

  /**
   * User clicked on a category, so we need to add/remove to/from the list
   *
   * @param { Category } category
   */
  protected onSelect(category: Category): void {
    this.analyticsSettingsStateService.onCategorySelect(category);
  }

  /**
   * Checks if the current month is already selected
   *
   * @param { Category } category
   */
  protected isCategorySelected(category: Category): boolean {
    return this.selectedCategories.findIndex((c: Category) => c === category) !== -1;
  }
}
