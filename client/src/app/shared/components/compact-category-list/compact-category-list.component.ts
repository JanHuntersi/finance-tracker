import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../core/services/category.service";
import {Category} from "../../../core/models/Category";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {JsonPipe, NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {BasicBudgetTableComponent} from "../basic-budget-table/basic-budget-table.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SubmitButtonComponent} from "../submit-button/submit-button.component";
import {CategoryTableComponent} from "../category-table/category-table.component";

@Component({
  selector: 'compact-category-list',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    NgClass,
    JsonPipe,
    MatIcon,
    BasicBudgetTableComponent,
    ReactiveFormsModule,
    SubmitButtonComponent,
    CategoryTableComponent
  ],
  templateUrl: './compact-category-list.component.html',
  styleUrl: './compact-category-list.component.css'
})
export class CompactCategoryListComponent implements OnInit {
  public categories: Array<Category> = new Array<Category>();
  public selectedType: string = "all";
  public selected: Array<Category> = new Array<Category>();

  public constructor(
    private categoryService: CategoryService
  ) {}

  public ngOnInit() {
    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;

        this.selected = this.categories;
      }
    });
  }

  /**
   * When user toggles between types, update data accordingly
   *
   * @param { string } selectedType
   */
  public changeSelected(selectedType: string): void {
    // Set selected type
    this.selectedType = selectedType;

    // Set selected data
    if (selectedType === 'expenses') {
      this.selected = this.categories.filter((category: Category) => category.type_id=== 1);
    } else if (selectedType === 'incomes') {
      this.selected = this.categories.filter((category: Category) => category.type_id === 2);
    } else if (selectedType === 'savings') {
      this.selected = this.categories.filter((category: Category) => category.type_id=== 3);
    } else {
      this.selected = this.categories;
    }
  }
}
