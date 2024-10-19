import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DetailedBudgetTable} from "../../../shared/components/detailed-budget-table/detailed-budget-table.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubmitButtonComponent} from "../../../shared/components/submit-button/submit-button.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationModalComponent} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import {NgIf} from "@angular/common";
import {CategoryService} from "../../../core/services/category.service";

@Component({
  selector: 'app-saving-goal-form',
  standalone: true,
  imports: [
    DetailedBudgetTable,
    ReactiveFormsModule,
    SubmitButtonComponent,
    NgIf
  ],
  templateUrl: './saving-goal-form.component.html',
  styleUrl: './saving-goal-form.component.css'
})
export class SavingGoalFormComponent implements OnInit {
  @Input() public goal: any | null = null;
  @Input() public totalSaved: number = 0;
  @Output() public cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() public formChangeEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() public goalEmitter: EventEmitter<any> = new EventEmitter<any>();

  public form: FormGroup = new FormGroup({});

  public constructor(
    public dialogRef: MatDialog,
    public categoryService: CategoryService,
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Save transaction and emit event that list was modified, so local update can be made, to avoid HTTP requests
   */
  public onSubmit(): void {
    if (this.form.valid) {
      const goal: any = this.form.value;
      if (this.goal?.id !== undefined) {
        goal.id = this.goal.id;
      }

      this.categoryService.updateGoal(goal).subscribe({
        next: (response: any) => {
          this.onCancel(true, goal);
        },
      });
    }
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      description: new FormControl(this.goal?.description || "", [
        Validators.maxLength(300),
      ]),
      motivation:  new FormControl(this.goal?.motivation || "", [
        Validators.maxLength(300),
      ]),
      amount:      new FormControl(this.goal?.amount || undefined, [
        Validators.min(0),
      ]),
      deadline:    new FormControl(this.goal?.deadline || undefined),
    });
  }

  /**
   * If form has been changed, ask for confirmation, then cancel the form
   *
   * @param { boolean } formSaved
   * @param { any } goal
   */
  public onCancel(formSaved: boolean = false, goal: any = undefined): void {
    if (this.form.untouched || formSaved) {
      this.cancelEmitter.emit();

      if (formSaved) {
        this.goalEmitter.emit(goal);
      }
    } else {
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.cancelEmitter.emit();
        }
      });
    }
  }
}
