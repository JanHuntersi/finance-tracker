import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {CategoryListComponent} from "../../../categories/category-list/category-list.component";
import {SearchBarComponent} from "../../../../core/components/header/search-bar/search-bar.component";
import {NgIf} from "@angular/common";
import {CategoryFormComponent} from "../../../categories/category-form/category-form.component";
import {MatIcon} from "@angular/material/icon";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/confirmation-modal/confirmation-modal.component";
import {CategoryService} from "../../../../core/services/category.service";
import {TransactionService} from "../../../../core/services/transaction.service";
import {
  ReassignCategoryModal
} from "../../../../shared/components/change-category-modal/reassign-category-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CategoryListComponent,
    SearchBarComponent,
    NgIf,
    CategoryFormComponent,
    MatIcon
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent {
  public adding: boolean = false;
  public formChanged: boolean = false;
  public refreshList: boolean = false;
  public searchString: string = "";
  public category: any = {};
  public categories: Array<any> = new Array<any>();
  public selectedCategories: Array<any> = new Array<any>();

  public constructor(
    public dialogRef: MatDialog,
    public categoryService: CategoryService,
    public transactionService: TransactionService,
  ) {}

  /**
   * When user wants to edit a category, we need to open the form
   *
   * @param { any } category
   */
  public onEdit(category: any): void {
    this.onActionButton();

    this.category = category;
  }

  /**
   * User clicked on a category, so we need to add/remove to/from the list
   *
   * @param { any } category
   */
  public onSelect(category: any): void {
    // Check if category with this id is already selected
    const categoryIndex: any = this.selectedCategories.findIndex(c => c.id === category.id);

    if (categoryIndex !== -1) {
      // Category exists, remove it
      this.selectedCategories.splice(categoryIndex, 1);
    } else {
      // Category does not exist, add it
      this.selectedCategories.push(category);
    }
  }

  /**
   * If only one category is selected, we want to open the form with its details, otherwise form should be empty
   */
  public onActionButton(): void {
    this.selectedCategories.length === 1 ? this.toggleEdit() : this.toggleAdd();
  }

  /**
   * Clear the state when adding, so form is fresh
   */
  public toggleAdd(): void {
    this.category = null;
    this.adding = !this.adding;
    this.formChanged = false;
  }

  /**
   * Select the first (and only) category, so form is filled
   */
  public toggleEdit(): void {
    this.category = this.selectedCategories[0];
    this.adding = !this.adding;
    this.formChanged = false;
  }

  /**
   * Save categories when list component loads them, so we can use them in handleReassigningCategories() if needed
   *
   * @param { any } categories
   */
  public saveCategories(categories: any): void {
    this.categories = categories;
  }

  /**
   * When deleting categories, we need to check if categories are used with transactions, and user needs to reassign
   * them before deleting them
   */
  public onDelete(): void {
    // We only need IDs of categories user wants to delete
    const categoryIds: Array<number> = [];
    this.selectedCategories.forEach((category: any) => {
      categoryIds.push(category.id);
    });

    // Check if any transactions are using categories user wants to delete
    this.transactionService.getTransactionsByMultipleCategories(categoryIds).subscribe({
      next: (response: any) => {
        const transactions = response.data.transactions;

        // If transactions exist with these categories, open a modal to reassign categories; otherwise, delete them
        if (transactions.length > 0) {
          this.handleReassigningCategories(categoryIds, transactions);
        } else {
          this.deleteCategories(categoryIds, true);
        }
      }
    })
  }

  /**
   * If transactions are using categories that user wants to delete, open a modal, where use can reassign them
   *
   * @param { Array<number> } categoryIds
   * @param { Array<any> } transactions
   */
  public handleReassigningCategories(categoryIds: Array<number>, transactions: Array<any>): void {
    // Categories that need to be reassigned by the user, derived from the transactions.
    const oldCategories: Array<any> = this.uniqueCategories(transactions);

    // Available categories for reassignment, excluding those that are to be deleted.
    const newCategories: Array<any> = this.categories.filter((category: any) => {
      return !categoryIds.includes(category.id);
    });

    // Open modal to reassign categories
    const dialogRef: MatDialogRef<ReassignCategoryModal> = this.dialogRef.open(ReassignCategoryModal, {
      data: {
        oldCategories: oldCategories,
        newCategories: newCategories,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.transactionService.updateCategoriesForTransactions(result).subscribe({
          next: () => {
            this.deleteCategories(categoryIds);
          }
        })
      }
    });
  }

  /**
   * Delete categories or a single category based on the number of IDs provided
   *
   * @param { Array<number> } categoryIds
   * @param { boolean } withModal
   */
  public deleteCategories(categoryIds: Array<number>, withModal: boolean = false): void {
    const deleteOperation: Observable<any[]> = categoryIds.length === 1
      ? this.categoryService.deleteCategory(categoryIds[0])
      : this.categoryService.deleteCategories(categoryIds);

    if (withModal) {
      // Open modal to reassign categories
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          deleteOperation.subscribe({
            next: () => {
              this.refreshList = !this.refreshList;
              this.selectedCategories = [];
            }
          });
        }
      });
    } else {
      deleteOperation.subscribe({
        next: () => {
          this.refreshList = !this.refreshList;
          this.selectedCategories = [];
        }
      });
    }
  }

  /**
   * Extract unique categories from transactions
   *
   * @param { Array<any> } transactions
   */
  public uniqueCategories (transactions: Array<any>): Array<any> {
    const seenCategoryIds: Set<number> = new Set();
    const uniqueCategories: Array<any> = [];

    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!seenCategoryIds.has(category.id)) {
        seenCategoryIds.add(category.id);
        uniqueCategories.push(category);
      }
    });

    return uniqueCategories;
  };

  /**
   * Get the search string from the search-bar component and send it to the list component.
   * The list component will update its categories based on the search string.
   *
   * @param { string } searchString
   */
  public onSearch(searchString: string): void {
    this.searchString = searchString;
  }

  /**
   * Retrieve the status from the form component to determine if a modal needs to be opened.
   * The modal will warn the user that their changes will be discarded if they cancel the form.
   */
  public onFormChange(): void {
    this.formChanged = true;
  }

  /**
   * Warn the user about their changes, and cancel the form
   */
  public onCancel(): void {
    if (this.formChanged) {
      // Open modal to reassign categories
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.adding = false;
        }
      });
    } else {
      this.adding = false;
    }
  }
}
