import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {TransactionTypeSelectComponent} from "../transaction-type-select/transaction-type-select.component";
import {DropdownComponent} from "../../../shared/components/dropdown/dropdown.component";
import {TransactionService} from "../../../core/services/transaction.service";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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
  @Input() public transaction: any | null = null;
  @Input() public categories: any | null = null;
  @Output() public cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() public formChangeEmitter: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup = new FormGroup({});

  public constructor(
    public dialogRef: MatDialog,
    public transactionService: TransactionService,
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Save transaction and emit event that list was modified, so local update can be made, to avoid HTTP requests
   */
  public onSubmit(): void {
    if (this.form.valid) {
      const transaction: any = this.form.value;
      if (this.transaction?.id !== undefined) {
        transaction.id = this.transaction.id;
      }

      this.transactionService.saveTransaction(transaction).subscribe({
        next: () => {
          this.onCancel(true);
        },
      });
    }
  }

  /**
   * If form has been changed, ask for confirmation, then cancel the form
   *
   * @param { boolean } withoutConfirmation
   */
  public onCancel(withoutConfirmation: boolean = false): void {
    if (this.form.untouched || withoutConfirmation) {
      this.cancelEmitter.emit();
    } else {
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.cancelEmitter.emit();
        }
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
