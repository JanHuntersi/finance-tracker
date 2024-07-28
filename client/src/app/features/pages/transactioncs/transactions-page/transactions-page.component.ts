import {Component, OnInit} from '@angular/core';
import {CategoryFormComponent} from "../../../categories/category-form/category-form.component";
import {CategoryListComponent} from "../../../categories/category-list/category-list.component";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {SearchBarComponent} from "../../../../core/components/header/search-bar/search-bar.component";
import {TransactionListComponent} from "../../../transactions/transaction-list/transaction-list.component";
import {TransactionFormComponent} from "../../../transactions/transaction-form/transaction-form.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../../../../core/services/category.service";
import {TransactionService} from "../../../../core/services/transaction.service";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/confirmation-modal/confirmation-modal.component";
import {Observable} from "rxjs";

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    MatIcon,
    NgIf,
    SearchBarComponent,
    TransactionListComponent,
    TransactionFormComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent implements OnInit {
  public adding: boolean = false;
  public formChanged: boolean = false;
  public refreshList: boolean = false;
  public searchString: string = "";
  public transaction: any = {};
  public transactions: Array<any> = new Array<any>();
  public categories: Array<any> = new Array<any>();
  public selectedTransactions: Array<any> = new Array<any>();

  public constructor(
    public dialogRef: MatDialog,
    public categoryService: CategoryService,
    public transactionService: TransactionService,
  ) {}

  public ngOnInit() {
    this.categoryService.getUserCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;
      }
    })
  }

  /**
   * When user wants to edit a transaction, we need to open the form
   *
   * @param { any } transaction
   */
  public onEdit(transaction: any): void {
    this.onActionButton();

    this.transaction = transaction;
  }

  /**
   * User clicked on a transaction, so we need to add/remove to/from the list
   *
   * @param { any } transaction
   */
  public onSelect(transaction: any): void {
    // Check if transaction with this id is already selected
    const transactionIndex: any = this.selectedTransactions.findIndex(c => c.id === transaction.id);

    if (transactionIndex !== -1) {
      // Category exists, remove it
      this.selectedTransactions.splice(transactionIndex, 1);
    } else {
      // Category does not exist, add it
      this.selectedTransactions.push(transaction);
    }
  }

  /**
   * If only one transaction is selected, we want to open the form with its details, otherwise form should be empty
   */
  public onActionButton(): void {
    this.selectedTransactions.length === 1 ? this.toggleEdit() : this.toggleAdd();
  }

  /**
   * Clear the state when adding, so form is fresh
   */
  public toggleAdd(): void {
    this.transaction = null;
    this.adding = !this.adding;
    this.formChanged = false;
  }

  /**
   * Select the first (and only) transaction, so form is filled
   */
  public toggleEdit(): void {
    this.transaction = this.selectedTransactions[0];
    this.adding = !this.adding;
    this.formChanged = false;
  }

  public onDelete(): void {
    // We only need IDs of transactions user wants to delete
    const transactionIds: Array<number> = [];
    this.selectedTransactions.forEach((transaction: any) => {
      transactionIds.push(transaction.id);
    });

    this.deleteTransactions(transactionIds, true);
  }

  /**
   * Delete categories or a single category based on the number of IDs provided
   *
   * @param { Array<number> } categoryIds
   * @param { boolean } withModal
   */
  public deleteTransactions(categoryIds: Array<number>, withModal: boolean = false): void {
    const deleteOperation: Observable<any[]> = categoryIds.length === 1
      ? this.transactionService.deleteTransaction(categoryIds[0])
      : this.transactionService.deleteTransactions(categoryIds);

    if (withModal) {
      // Open modal to reassign categories
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          deleteOperation.subscribe({
            next: () => {
              this.refreshList = !this.refreshList;
              this.selectedTransactions = [];
            }
          });
        }
      });
    } else {
      deleteOperation.subscribe({
        next: () => {
          this.refreshList = !this.refreshList;
          this.selectedTransactions = [];
        }
      });
    }
  }

  /**
   * Get the search string from the search-bar component and send it to the list component.
   * The list component will update its transactions based on the search string.
   *
   * @param { string } searchString
   */
  public onSearch(searchString: string): void {
    this.searchString = searchString;
  }

  /**
   * Warn the user about their changes, and cancel the form
   */
  public onCancel(): void {
    if (this.formChanged) {
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
