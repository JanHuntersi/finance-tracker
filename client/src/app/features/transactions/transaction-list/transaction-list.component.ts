import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {TransactionService} from "../../../core/services/transaction.service";
import {CategoryService} from "../../../core/services/category.service";
import {MatIcon} from "@angular/material/icon";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";
import {getClassBasedOnType} from "../../../core/helpers/mapper";

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TransactionFormComponent,
    MatIcon,
    TypePipe,
    NgClass,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  @Input() public searchString: string = "";
  @Input() public selectedTransactions: Array<any> = new Array<any>();
  @Input() public refreshList: boolean = false;

  @Output() public selectedTransaction: EventEmitter<any> = new EventEmitter<any>();
  @Output() public editTransaction: EventEmitter<any> = new EventEmitter<any>();
  @Output() public transactionEmitter: EventEmitter<any> = new EventEmitter<any>();

  public transactions: Array<any> = [];
  public categories: Array<any> = [];
  public filteredTransactions: Array<any> = [];

  public constructor(
    public categoryService: CategoryService,
    public transactionService: TransactionService,
  ) {}

  public ngOnInit(): void {
    this.getTransactions();
  }

  /**
   * Get categories that belong to the user
   */
  public getTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (response: any) => {
        this.transactions = response.data.transactions;
        this.updateList();
        this.transactionEmitter.emit(this.transactions);

        this.categoryService.getUserCategories().subscribe({
          next: (response: any) => {
            this.categories = response.data.categories;
          },
        })
      },
    });
  }

  /**
   * Checks if the current transaction is already selected, so it knows if it should color the background
   *
   * @param { any } transaction
   */
  public isTransactionSelected(transaction: any): boolean {
    return this.selectedTransactions.findIndex(t => t.id === transaction.id) !== -1;
  }

  /**
   * If user clicks a transaction, emit the transaction to page component, so it adds the transaction to the selected transactions
   *
   * @param { any } transaction
   */
  public onSelect(transaction: any): void {
    this.selectedTransaction.emit(transaction);
  }

  /**
   * If user double-clicks a transaction, emit the transaction to page component, so it opens the edit form with its details
   *
   * @param { any } transaction
   */
  public onDoubleClick(transaction: any): void {
    this.editTransaction.emit(transaction);
  }

  /**
   * Checking for changes on @Input() properties
   *
   * @param { SimpleChanges } changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // User input something into the search string
    if (changes['searchString']) {
      this.updateList();
    }

    // User deleted categories, so we need to refresh the list
    if (changes['refreshList']) {
      this.getTransactions();
    }
  }

  /**
   * Update the list with filtered categories based on the search string
   */
  public updateList(): void {
    const searchTerm: string = this.searchString.toLowerCase();
    this.filteredTransactions = this.transactions.filter(category =>
      category.name.toLowerCase().includes(searchTerm) || category.description.toLowerCase().includes(searchTerm)
    );
  }

  protected readonly getClassBasedOnType = getClassBasedOnType;
}
