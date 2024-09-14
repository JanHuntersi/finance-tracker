import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubmitButtonComponent} from "../../../shared/components/submit-button/submit-button.component";
import {BudgetService} from "../../../core/services/budget.service";
import {DetailedBudgetTable} from "../../../shared/components/detailed-budget-table/detailed-budget-table.component";
import {roundFormControlTo2Decimals, roundValueTo2Decimals} from "../../../core/helpers/numbers";

@Component({
  selector: 'app-advanced-budget-form',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    ReactiveFormsModule,
    SubmitButtonComponent,
    DetailedBudgetTable
  ],
  templateUrl: './detailed-budget-form.component.html',
  styleUrl: './detailed-budget-form.component.css'
})
export class DetailedBudgetFormComponent implements OnInit {
  @Input() public budget: any;
  @Input() public categories: Array<any> = new Array<any>();
  @Input() public editing: boolean = false;

  @Output() public formUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public budgetSaved: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(DetailedBudgetTable) public advancedBudgetTable: DetailedBudgetTable | undefined;

  public form: FormGroup = new FormGroup({});
  public selectedType: string = "expenses";
  public selected: Array<any> = [];
  private expenses: Array<any> = new Array<any>();
  private incomes: Array<any> = new Array<any>();
  private savings: Array<any> = new Array<any>();
  public yearTotals: { [key: string]: number } = {};
  public monthTotals: { [key: string]: number } = {};

  public constructor(
    public budgetService: BudgetService,
  ) {}

  public ngOnInit(): void {
    this.prepareBudgetData();
    this.initializeForm();
  }

  /**
   * Format the budget data in a specific format, so we can display it with a table
   */
  private prepareBudgetData(): void {
    const setup = this.budget.length === 0;
    const data = setup ? this.categories : this.budget;

    this.createBudgetData(data, setup);
  }

  /**
   * Create budget data based on if user has a budget set or not
   *
   * @param { any } budget
   * @param { boolean } setup
   */
  private createBudgetData(budget: any, setup: boolean): void {
    let category: any = {
      'id': '',
      'icon': '',
      'title': '',
      'amounts': [],
    };

    budget.forEach((budgetEntry: any) => {
      // Create a data object based on if user has a budget already set or not
      const data: any = {
        'id': setup ? budgetEntry.id : budgetEntry.category.id,
        'icon': setup ? budgetEntry.icon : budgetEntry.category.icon,
        'name': setup ? budgetEntry.name : budgetEntry.category.name,
        'amount': setup ? 0 : budgetEntry.amount,
        'typeId': setup ? budgetEntry.type_id : budgetEntry.category.type_id,
      }

      // If budget is not set, or the budgetEntry is from a new month, create a category
      if (setup || budgetEntry.month === 0) {
        category = {
          'id': data['id'],
          'title': data['name'],
          'icon': data['icon'],
          'amounts': [],
        };
      }

      // Get iteration count
      const iterations = setup ? [...Array(12).keys()] : [budgetEntry.month];

      // Add amount for each iteration
      iterations.forEach((iteration: any) => {
        // Add amount to the array
        category['amounts'].push(data['amount']);

        // If we are at the last month, add the category
        if (iteration === 11) {
          // Add category to the correct type
          this.categorizeBudgetByType(data['typeId'], category);
        }
      });
    });
  }

  /**
   * Adds a category to the correct type
   *
   * @param { number } typeId
   * @param { any } category
   */
  private categorizeBudgetByType(typeId: number, category: any): void {
    if (typeId === 1) {
      this.expenses.push(category);
    } else if (typeId === 2) {
      this.incomes.push(category);
    } else {
      this.savings.push(category);
    }
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
      this.selected = this.expenses;
    } else if (selectedType === 'incomes') {
      this.selected = this.incomes;
    } else if (selectedType === 'savings') {
      this.selected = this.savings;
    }

    // Calculate year and month totals for the selected type
    this.calculateYearTotal(selectedType);
    this.calculateMonthTotal(selectedType);
  }


  /**
   * To avoid unnecessary queries, only get the inputs that were updated
   */
  private getUpdatedInputs(): any {
    const changedValues: any = {};

    // Go through all form controls, and check if they are dirty (were updated)
    Object.keys(this.form.controls).forEach(key => {
      // Get control with this key
      const control = this.form.get(key);

      // If the control is dirty, add it to the changed values
      if (control && control.dirty) {
        changedValues[key] = control.value;
      }
    });

    return changedValues;
  }

  /**
   * Emit to parent component that form was updated
   */
  public onFormUpdate(): void {
    this.formUpdated.emit(true);
  }

  /**
   * When input value changes, re-calculate the totals to have the correct amount
   *
   * @param { string } controlName
   */
  public onInputChange(controlName: string): void {
    // Round input to 2 decimals
    roundFormControlTo2Decimals(this.form, controlName);

    // Control names are in format 'expense_1_3'
    const inputInformation: string[] = controlName.split('_');

    // Get the needed information
    const type: string = inputInformation[0];
    const category: number = parseInt(inputInformation[1]);
    const month: number = parseInt(inputInformation[2]);

    // Calculate totals
    this.calculateYearTotal(type, category);
    this.calculateMonthTotal(type, month);
  }

  /**
   * Calculate year totals for the selected categories
   *
   * @param { string } type
   * @param { number | null } category
   */
  private calculateYearTotal(type: string, category: number | null = null): void {
    // When component first loads, calculate year total for all categories
    if (category === null) {
      // Calculate year total for all categories
      this.selected.forEach((c: any) => {
        this.calculateYearTotal(type, c.id);
      });
    } else {
      let yearTotal: number = 0;

      // Calculate year totals
      for (let month = 0; month < 12; month++) {
        // Gets the control name
        const controlName: string = `${type}_${category}_${month}`;

        // Round input to 2 decimals
        roundFormControlTo2Decimals(this.form, controlName);

        // Get the control value
        const controlValue: string = this.form.get(controlName)?.value;

        // Add to year total
        yearTotal += parseFloat(controlValue) || 0;
      }

      // Set new year total
      this.yearTotals[category] = roundValueTo2Decimals(yearTotal);
    }
  }

  /**
   * Calculate month totals for the selected categories
   *
   * @param { string } type
   * @param { number | null } month
   */
  private calculateMonthTotal(type: string, month: number | null = null): void {
    // When component first loads, calculate month total for all months
    if (month === null) {
      // Calculate month total for all months
      for (let m = 0; m < 12; m++) {
        this.calculateMonthTotal(type, m);
      }
    } else {
      let monthTotal: number = 0;

      // Calculate month totals
      this.selected.forEach((c: any) => {
        // Gets the control name
        const controlName: string = `${type}_${c.id}_${month}`;

        // Round input to 2 decimals
        roundFormControlTo2Decimals(this.form, controlName);

        // Get the control value
        const controlValue: string = this.form.get(controlName)?.value;

        // Add to year total
        monthTotal += parseFloat(controlValue) || 0;
      })

      // Set new year total
      this.monthTotals[month] = roundValueTo2Decimals(monthTotal);
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      // If user is setting up their budget, save all categories, otherwise only the updated ones
      const budget: any = this.budget.length > 0 ? this.getUpdatedInputs() : this.form.value;

      // Save budget
      this.budgetService.saveBudget(budget, true, this.editing, this.budget['id']).subscribe({
        next: (response: any) => {
          this.formUpdated.emit(false);

          // In advanced-budget-table component, refresh the updated inputs, so they are not colored blue anymore
          if (this.advancedBudgetTable) {
            this.advancedBudgetTable.refreshUpdatedInputs();
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
    // Create form controls for all expense categories
    this.expenses.forEach((category: any) => {
      this.createControls('expenses', category);
    })

    // Create form controls for all income categories
    this.incomes.forEach((category: any) => {
      this.createControls('incomes', category);
    })

    // Create form controls for all savings categories
    this.savings.forEach((category: any) => {
      this.createControls('savings', category);
    })

    // By default select expenses
    this.changeSelected('expenses');
  }

  /**
   * Creates an input form control for each month for this category.
   * Control names are in format 'type_category_index'
   *
   * @param { string } type
   * @param { any } category
   */
  private createControls(type: string, category: any): void {
    // Create control for each month
    for (let i = 0; i < 12; i++) {
      // Create form control
      const control: FormControl<any> = new FormControl(
        category['amounts'][i] || 0, [Validators.min(0), Validators.required]
      );

      // Create control name
      const controlName: string = `${type}_${category.id}_${i}`;

      // Add control to form
      this.form.addControl(controlName, control);
    }
  }
}
