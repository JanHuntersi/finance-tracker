import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CategoryService} from "../../../../core/services/category.service";
import {Category} from "../../../../core/models/Category";
import {MatIcon} from "@angular/material/icon";
import {TransactionService} from "../../../../core/services/transaction.service";
import {Transaction} from "../../../../core/models/Transaction";
import {SavingGoalFormComponent} from "../../../savings/saving-goal-form/saving-goal-form.component";
import {TransactionFormComponent} from "../../../transactions/transaction-form/transaction-form.component";
import {TransactionListComponent} from "../../../transactions/transaction-list/transaction-list.component";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/confirmation-modal/confirmation-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SavingGoalDetailsComponent} from "../../../savings/saving-goal-details/saving-goal-details.component";
import {
  SavingTransactionsListComponent
} from "../../../savings/saving-transactions-list/saving-transactions-list.component";

@Component({
  selector: 'app-savings-page',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatIcon,
    SavingGoalFormComponent,
    TransactionFormComponent,
    TransactionListComponent,
    SavingGoalDetailsComponent,
    SavingTransactionsListComponent,
    NgClass
  ],
  templateUrl: './savings-page.component.html',
  styleUrl: './savings-page.component.css'
})
export class SavingsPageComponent implements OnInit {
  public loading: boolean = true;
  public categories: Array<Category> = new Array<Category>();
  public transactions: Array<Transaction> = new Array<Transaction>();
  public selectedCategory: Category | null = null;
  public selectedCategoryTransactions: Array<Transaction> = new Array<Transaction>();
  public totalSaved: number = 0;
  public editing: boolean = false;
  public formChanged: boolean = false;
  public showGoal: boolean = true;

  public constructor(
    public categoryService: CategoryService,
    public transactionService: TransactionService,
    public dialogRef: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.loading = false;

    this.getCategories();
  }

  /**
   * Warn the user about their changes, and cancel the form
   */
  public onCancel(): void {
    if (this.formChanged) {
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.editing = false;
        }
      });
    } else {
      this.editing = false;
    }
  }

  public onSave(goal: any): void {
    if (this.selectedCategory) {
      this.selectedCategory.goals[0] = goal;
    }
  }

  public onEdit(): void {
    this.editing = !this.editing;
    this.formChanged = false;
  }

  public getCategories(): void {
    this.categoryService.getSavingsCategories().subscribe({
      next: (response: any) => {
        // Save the categories
        this.categories = response.data.categories;

        // Get only ids of the savings categories
        const categoryIds: Array<number> = this.categories.map((category: Category) => category.id);

        // Get transactions for all the savings categories
        this.transactionService.getTransactionsByMultipleCategories(categoryIds).subscribe({
          next: (response: any) => {
            this.transactions = response.data.transactions;
          }
        })
      }
    });
  }

  public onCategorySelect(category: Category): void {
    // Select the category
    this.selectedCategory = category;

    // Filter the transactions based on the selected category
    this.selectedCategoryTransactions =
      this.transactions.filter((transaction: Transaction) => transaction.category_id === category.id);

    this.totalSaved = this.selectedCategoryTransactions.reduce((sum: number, transaction: Transaction) => {
      return sum + transaction.amount;
    }, 0);
  }
}
