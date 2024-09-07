import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MonthNamePipe} from "../../../core/pipes/month-name.pipe";
import {MatIcon} from "@angular/material/icon";
import {SubmitButtonComponent} from "../../../shared/components/submit-button/submit-button.component";
import {BudgetService} from "../../../core/services/budget.service";

@Component({
  selector: 'app-basic-budget-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    MonthNamePipe,
    MatIcon,
    NgIf,
    SubmitButtonComponent
  ],
  templateUrl: './basic-budget-form.component.html',
  styleUrl: './basic-budget-form.component.css'
})
export class BasicBudgetFormComponent implements OnInit {
  @Input() budget: any;
  @Input() categories: Array<any> = new Array<any>();
  @Input() editing: boolean = false;

  @Output() formUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  public form: FormGroup = new FormGroup({});
  public expenses: Array<any> = new Array<any>();
  public incomes: Array<any> = new Array<any>();
  public savings: Array<any> = new Array<any>();

  public constructor(
    public budgetService: BudgetService,
  ) {}

  public ngOnInit(): void {
    this.categorizeCategoriesByType();
    this.initializeForm();
  }

  /**
   * Categorize categories by type, so code is more readable
   */
  public categorizeCategoriesByType(): void {
    this.expenses = this.categories.filter((category: any): boolean => {
      return category.type_id === 1;
    });

    this.incomes = this.categories.filter((category: any): boolean => {
      return category.type_id === 2;
    });

    this.savings = this.categories.filter((category: any): boolean => {
      return category.type_id === 3;
    });
  }
  public onSubmit(): void {
    if (this.form.valid) {
      this.budgetService.saveBudget(this.form.value, false, this.editing, this.budget['id']).subscribe({
        next: (response: any) => {
          this.formUpdated.emit(false);
        }
      })
    }
  }

  /**
   * Emit to parent component that form was updated
   */
  public onFormUpdate(): void {
    this.formUpdated.emit(true);
  }

  /**
   * Initializes form, by creating a new control for each category the user has
   */
  public initializeForm(): void {
    this.expenses.forEach((expenseCategory: any) => {
      const control: FormControl<any> = new FormControl(
        this.budget['budget'][expenseCategory.id] || 0, [Validators.min(0), Validators.required]
      );

      this.form.addControl('expenses_' + expenseCategory.id, control);
    });

    this.incomes.forEach((incomeCategory: any) => {
      const control: FormControl<any> = new FormControl(
        this.budget['budget'][incomeCategory.id] || 0, [Validators.min(0), Validators.required]
      );

      this.form.addControl('incomes_' + incomeCategory.id, control);
    });

    this.savings.forEach((savingsCategory: any) => {
      const control: FormControl<any> = new FormControl(
        this.budget['budget'][savingsCategory.id] || 0, [Validators.min(0), Validators.required]
      );

      this.form.addControl('savings_' + savingsCategory.id, control);
    });
  }
}
