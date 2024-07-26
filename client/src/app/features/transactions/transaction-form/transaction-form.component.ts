import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {TransactionTypeSelectComponent} from "../transaction-type-select/transaction-type-select.component";
import {DropdownComponent} from "../../../shared/components/dropdown/dropdown.component";
import {Category} from "../../../core/models/Category";
import {TransactionService} from "../../../core/services/transaction.service";
import {Transaction} from "../../../core/models/Transaction";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {TransactionStateService} from "../../../core/services/transaction-state.service";

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    TransactionTypeSelectComponent,
    UpperCasePipe,
    DropdownComponent,
    JsonPipe
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  @Input() public categories: Array<Category> = [];
  @Input() public transaction: Transaction | null = null;

  @Output() public transactionListModified: EventEmitter<Transaction> = new EventEmitter<Transaction>();

  public form: FormGroup = new FormGroup({});

  public constructor(
    public stateService: TransactionStateService,
    public transactionService: TransactionService,
    public modal: ConfirmationModalComponent,
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Emit to the parent component that the form has changed
   */
  public onFormChange(): void {
    this.stateService.formChanged = true;
  }

  /**
   * If form has been changed, ask for confirmation, then cancel the form
   */
  public onCancel(): void {
    if (this.stateService.formChanged) {
      this.modal.openModal().subscribe((result: boolean) => {
        if (result) {
          this.cancel();
        }
      });
    } else {
      this.cancel();
    }
  }

  public cancel(): void {
    if (this.stateService.adding) {
      this.stateService.toggleAddForm(false);
    } else {
      this.stateService.selectedTransaction = null;
      this.stateService.onCancel();
    }
  }

  /**
   * Save transaction and emit event that list was modified, so local update can be made, to avoid HTTP requests
   */
  public onSubmit(): void {
    if (this.form.valid) {
      const transaction: Transaction = this.form.value;
      if (this.transaction?.id !== undefined) {
        transaction.id = this.transaction.id;
      }

      this.transactionService.saveTransaction(transaction).subscribe({
        next: (response: any) => {
          this.transactionListModified.emit(response.data.transaction);
          this.cancel();
        },
        error: (response: any) => {
          console.log("Not saved");
        },
      });
    }
  }

  /**
   * Initialize form
   */
  public initializeForm(): void {
    const today: string = new Date().toISOString().substring(0, 16);

    this.form = new FormGroup({
      name:             new FormControl(this.transaction?.name || undefined, [
        Validators.required,
      ]),
      description:             new FormControl(this.transaction?.description || undefined, [
        Validators.maxLength(300)
      ]),
      amount:             new FormControl(this.transaction?.amount || undefined, [
        Validators.required,
        Validators.min(0),
      ]),
      type_id:             new FormControl(this.transaction?.type_id || undefined, [
        Validators.required,
      ]),
      category_id:             new FormControl(this.transaction?.category_id || undefined, [
        Validators.required,
      ]),
      date:             new FormControl(this.transaction?.date || today, [
        Validators.required,
      ]),
    });
  }

}
