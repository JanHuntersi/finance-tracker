import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Transaction} from "../../../core/models/Transaction";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {TransactionService} from "../../../core/services/transaction.service";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {Category} from "../../../core/models/Category";
import {TransactionStateService} from "../../../core/services/transaction-state.service";

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TransactionFormComponent,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
  @Input() public categories: Array<Category> = [];
  @Input() public transactions: Array<any> = [];

  public constructor(
    public stateService: TransactionStateService,
    public transactionService: TransactionService,
    public modal: ConfirmationModalComponent,
  ) {}

  /**
   * When user wants to delete a transaction, ask for confirmation first, then delete it
   *
   * @param { number } id
   */
  public onDelete(id: number): void {
    this.modal.openModal().subscribe((result: boolean) => {
      if (result) {
        this.transactionService.deleteTransaction(id).subscribe({
          next: (response: any) => {
            this.updateList(id);
          },
        });
      }
    });
  }

  /**
   * When user double-clicks a transaction, we want to select it, and open an edit form.
   * If the same transaction is double-clicked again, we want to close the edit form, but ask for confirmation if form
   * was changed.
   *
   * @param { Transaction } transaction
   */
  public onDoubleClick(transaction: Transaction): void {
    const sameTransaction: boolean = this.stateService.selectedTransaction == transaction;

    if (sameTransaction) {
      this.handleSameTransaction();
    } else {
      this.handleDifferentTransaction(transaction);
    }
  }

  /**
   * If form has changed, ask for confirmation, then close the edit form
   */
  public handleSameTransaction(): void {
    if (this.stateService.formChanged) {
      this.modal.openModal().subscribe((result: boolean): void => {
        if (result) {
          this.onCancel();
        }
      });
    } else {
      this.onCancel();
    }
  }

  /**
   * If form has changed, ask for confirmation, then open edit form for the selected transaction
   *
   * @param { Transaction } transaction
   */
  public handleDifferentTransaction(transaction: Transaction): void {
    if (this.stateService.formChanged) {
      this.modal.openModal().subscribe((result: boolean): void => {
        if (result) {
          this.stateService.selectedTransaction = transaction;
          this.stateService.openEditForm();
        }
      });
    } else {
      this.stateService.selectedTransaction = transaction;
      this.stateService.openEditForm();
    }
  }

  /**
   * Cancel editing and emit to parent component that cancel happened
   */
  public onCancel(): void {
    this.stateService.selectedTransaction = null;
    this.stateService.onCancel();
  }

  /**
   * To avoid sending a new HTTP request when list is updated (edited/deleted transaction), update it locally
   *
   * @param { number } id
   * @param { Transaction | null } transaction
   */
  public updateList(id: number, transaction: Transaction | null = null): void {
    const index: number = this.transactions.findIndex(t => t.id === id);

    if (index !== -1) {
      if (transaction !== null) {
        this.transactions[index] = transaction; // Transaction was edited
      } else {
        this.transactions.splice(index, 1); // Transaction was deleted
      }
    }
  }
}
