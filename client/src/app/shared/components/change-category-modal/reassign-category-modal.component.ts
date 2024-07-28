import { Component, Inject } from '@angular/core';
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { MatFormField } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatLabel } from "@angular/material/input";

@Component({
  selector: 'reassign-category-modal',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    NgForOf,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    NgIf,
  ],
  templateUrl: './reassign-category-modal.component.html',
  styleUrl: './reassign-category-modal.component.css'
})
export class ReassignCategoryModal {
  public oldCategories: Array<any> = [];
  public newCategories: Array<any> = [];
  public form: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<ReassignCategoryModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.oldCategories = data.oldCategories;
    this.newCategories = data.newCategories;

    this.initializeForm();
  }

  public initializeForm(): void {
    // Create a form for each category user needs to reassign
    this.oldCategories.forEach((category: any) => {
      this.form.addControl(
        `${category.id}`,
        new FormControl('', Validators.required)
      );
    })
  }

  /**
   * Close the form, and return the reassigned categories
   */
  public onConfirm(): void {
    const reassignedCategories = this.form.value;
    this.dialogRef.close([reassignedCategories]);
  }
}
