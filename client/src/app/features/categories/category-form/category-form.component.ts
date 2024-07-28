import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DropdownComponent} from "../../../shared/components/dropdown/dropdown.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  TransactionTypeSelectComponent
} from "../../transactions/transaction-type-select/transaction-type-select.component";
import {CategoryService} from "../../../core/services/category.service";
import {IconPickerComponent} from "../../../shared/components/icon-picker/icon-picker.component";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    DropdownComponent,
    ReactiveFormsModule,
    TransactionTypeSelectComponent,
    IconPickerComponent
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  @Input() public category: any | null = null;
  @Output() public cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() public formChangeEmitter: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup = new FormGroup({});

  public constructor(
    public dialogRef: MatDialog,
    public categoryService: CategoryService,
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Save category and emit event that list was modified, so local update can be made, to avoid HTTP requests
   */
  public onSubmit(): void {
    if (this.form.valid) {
      const category: any = this.form.value;
      if (this.category?.id !== undefined) {
        category.id = this.category.id;
      }

      this.categoryService.saveCategory(category).subscribe({
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
   * Initialize the form
   */
  public initializeForm(): void {
    this.form = new FormGroup({
      name:             new FormControl(this.category?.name || undefined, [
        Validators.required,
      ]),
      description:             new FormControl(this.category?.description || undefined, [
        Validators.maxLength(300)
      ]),
      type_id:             new FormControl(this.category?.type_id || undefined, [
        Validators.required,
      ]),
      icon:             new FormControl(this.category?.icon || undefined, [
        Validators.required,
      ]),
    });
  }
}
