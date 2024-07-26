import { Component } from '@angular/core';
import {Transaction} from "../../../core/models/Transaction";
import {Category} from "../../../core/models/Category";
import {AuthService} from "../../../core/services/auth-service.service";
import {CategoryService} from "../../../core/services/category.service";
import {TransactionService} from "../../../core/services/transaction.service";
import {TransactionStateService} from "../../../core/services/transaction-state.service";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {NgIf} from "@angular/common";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";

@Component({
  selector: 'app-transaction-wrapper',
  standalone: true,
  imports: [
    NgIf,
    TransactionFormComponent,
    TransactionListComponent
  ],
  templateUrl: './transaction-wrapper.component.html',
  styleUrl: './transaction-wrapper.component.css'
})
export class TransactionWrapperComponent {
  public transactions: Array<Transaction> = [];
  public categories: Array<Category> = [];

  public constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    public transactionService: TransactionService,
    public stateService: TransactionStateService,
    public modal: ConfirmationModalComponent,
  ) {}

  public ngOnInit(): void {
    this.getUserData();
  }

  public getUserData(): void {
    this.transactionService.getTransactions(this.authService.user.id).subscribe({
      next: (response: any) => {
        this.transactions = response.data.transactions;

        this.categoryService.getUserCategories().subscribe({
          next: (response: any) => {
            this.categories = response.data.categories;
          },
        })
      },
    });
  }

  public toggleAddForm(status: boolean): void {
    if (this.stateService.formChanged && status) {
      this.modal.openModal().subscribe((result: boolean): void => { // Ask for confirmation
        if (result) {
          this.stateService.toggleAddForm(status);
        }
      });
    } else {
      this.stateService.toggleAddForm(status);
    }
  }

  /**
   * When transaction is added, add the transaction to the start of the list, to avoid a new HTTP request
   *
   * @param { Transaction } transaction
   */
  public updateList(transaction: Transaction): void {
    this.transactions.unshift(transaction);
  }
}
