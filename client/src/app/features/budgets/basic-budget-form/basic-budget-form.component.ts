import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MonthNamePipe} from "../../../core/pipes/month-name.pipe";
import {MatIcon} from "@angular/material/icon";
import {SubmitButtonComponent} from "../../../shared/components/submit-button/submit-button.component";
import {BudgetService} from "../../../core/services/budget.service";
import {BasicBudgetTableComponent} from "../../../shared/components/basic-budget-table/basic-budget-table.component";
import {DetailedBudgetTable} from "../../../shared/components/detailed-budget-table/detailed-budget-table.component";
import {roundFormControlTo2Decimals} from "../../../core/helpers/numbers";

@Component({
  selector: 'basic-budget-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    MonthNamePipe,
    MatIcon,
    NgIf,
    SubmitButtonComponent,
    BasicBudgetTableComponent,
    DetailedBudgetTable
  ],
  templateUrl: './basic-budget-form.component.html',
  styleUrl: './basic-budget-form.component.css'
})
export class BasicBudgetFormComponent implements OnInit {
  @Input() public budget: any;
  @Input() public categories: Array<any> = new Array<any>();
  @Input() public editing: boolean = false;

  @Output() public formUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public budgetSaved: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(BasicBudgetTableComponent) public basicBudgetTable: BasicBudgetTableComponent | undefined;

  public form: FormGroup = new FormGroup({});
  public selectedType: string = "expenses";
  public selected: Array<any> = [];
  private expenses: Array<any> = new Array<any>();
  private incomes: Array<any> = new Array<any>();
  private savings: Array<any> = new Array<any>();
  public total: number = 0;

  public constructor(
    public budgetService: BudgetService,
  ) {}

  public ngOnInit(): void {
    this.categorizeBudgetByType();
    this.initializeForm();
  }

  /**
   * Adds a category to the correct type
   */
  private categorizeBudgetByType(): void {
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

  /**
   * When user toggles between types, update data accordingly
   *
   * @param { string } selectedType
   */
  public changeSelected(selectedType: string): void {
    // Set selected type
    this.selectedType = selectedType;

    // Set selected data
    if (selectedType === 'expenses') {
      this.selected = this.budget['budget'].filter((budgetEntry: any) => budgetEntry['type'] === 1);
    } else if (selectedType === 'incomes') {
      this.selected = this.budget['budget'].filter((budgetEntry: any) => budgetEntry['type'] === 2);
    } else if (selectedType === 'savings') {
      this.selected = this.budget['budget'].filter((budgetEntry: any) => budgetEntry['type'] === 3);
    }

    // Calculate total of the newly selected type
    this.calculateTotal(selectedType);
  }

  /**
   * To avoid unnecessary queries, only get the inputs that were updated
   */
  private getUpdatedInputs(): any {
    const updatedValues: any = {};

    // Go through all form controls, and check if they are dirty (were updated)
    Object.keys(this.form.controls).forEach(key => {
      // Get control with this key
      const control = this.form.get(key);

      // If the control is dirty, add it to the changed values
      if (control && control.dirty) {
        updatedValues[key] = control.value;
      }
    });

    return updatedValues;
  }

  /**
   * Emit to parent component that form was updated
   */
  public onFormUpdate(): void {
    this.formUpdated.emit(true);
  }

  /**
   * When input value changes, re-calculate the total to have the correct amount
   *
   * @param { string } controlName
   */
  public onInputChange(controlName: string): void {
    // Round input to 2 decimals
    roundFormControlTo2Decimals(this.form, controlName);

    // Control names are in format 'expense_1'
    const inputInformation: string[] = controlName.split('_');

    // Get the needed information
    const type: string = inputInformation[0];

    // Calculate total
    this.calculateTotal(type);
  }

  /**
   * Calculate the total of all categories
   *
   * @param { string } type
   */
  private calculateTotal(type: string): void {
    // When component first loads, calculate month total for all months
    let total: number = 0;

    // Calculate month totals
    this.selected.forEach((c: any) => {
      // Gets the control name
      const controlName: string = `${type}_${c.id}`;

      // Get the control value
      const controlValue: string = this.form.get(controlName)?.value;

      // Add to year total
      total += parseFloat(controlValue) || 0;
    })

    // Set new year total
    this.total = Number(total.toFixed(2));
  }

  public onSubmit(): void {
    if (this.form.valid) {
      // If user is setting up their budget, save all categories, otherwise only the updated ones
      const budget: any = this.budget.id ? this.getUpdatedInputs() : this.form.value;

      this.budgetService.saveBudget(budget, false, this.editing, this.budget['id']).subscribe({
        next: (response: any) => {
          this.formUpdated.emit(false);

          // In basic-budget-table component, refresh the updated inputs, so they are not colored blue anymore
          if (this.basicBudgetTable) {
            this.basicBudgetTable.refreshUpdatedInputs();
          }

          this.budgetSaved.emit();
        }
      })
    }
  }

  /**
   * Initializes form, by creating a new control for each category the user has
   */
  private initializeForm(): void {
    this.expenses.forEach((category: any) => {
      this.createControl('expenses', category);
    });

    this.incomes.forEach((category: any) => {
      this.createControl('incomes', category);
    });

    this.savings.forEach((category: any) => {
      this.createControl('savings', category);
    });

    // By default select expenses
    this.changeSelected('expenses');
  }

  /**
   * Creates an input form control for this category.
   * Control names are in format 'type_category'
   *
   * @param { string } type
   * @param { any } category
   */
  private createControl(type: string, category: any): void {
    // Find the correct category, and get its value from the simplified budget
    const defaultValue = this.budget['budget'].find((budgetEntry: any) => budgetEntry.id === category.id).amount;

    // Create form control
    const control: FormControl<any> = new FormControl(
      defaultValue || 0, [Validators.min(0), Validators.required]
    );

    // Create control name
    const controlName: string = `${type}_${category.id}`;

    // Add control to form
    this.form.addControl(controlName, control);
  }
}
