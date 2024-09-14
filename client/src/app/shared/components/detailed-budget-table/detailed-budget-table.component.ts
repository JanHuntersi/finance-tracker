import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {months} from "../../../core/config/months";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {roundValueTo2Decimals} from "../../../core/helpers/numbers";

@Component({
  selector: 'detailed-budget-table',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgClass,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatFooterRow,
    MatFooterCell,
    MatFooterCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatFooterRowDef
  ],
  templateUrl: './detailed-budget-table.component.html',
  styleUrl: './detailed-budget-table.component.css'
})
export class DetailedBudgetTable implements OnInit, OnChanges {
  @Input() public form: FormGroup = new FormGroup({});
  @Input() public data: any = {};
  @Input() public yearTotals: { [key: string]: number } = {};
  @Input() public monthTotals: { [key: string]: number } = {};
  @Input() public selectedType: string = "";

  @Output() public inputChange: EventEmitter<string> = new EventEmitter<string>();

  private updatedInputs: Set<string> = new Set();
  private initialValues: Map<string, any> = new Map();
  public displayedColumns: string[] = ['category', ...months.map((_, i) => 'month_' + i), 'total'];
  public totalOfTotals: number = 0;

  public ngOnInit(): void {
    this.storeInitialValues();
    this.calculateTotalOfTotals();
  }

  /**
   * Store the initial values of all form controls, so user can see their changes more clearly.
   * If user changes an input from 0 -> 10, it colors blue, then from 10 -> 0, it colors white again, as it went back to
   * its initial value
   */
  private storeInitialValues(): void {
    // Go through all form controls and save their initial values
    Object.keys(this.form.controls).forEach((controlName: string) => {
      // Get value of the control with this name
      const controlValue = this.form.get(controlName)?.value;

      // Save the initial value for this control
      this.initialValues.set(controlName, controlValue);
    });
  }

  /**
   * Checks if control with the given name was updated
   *
   * @param { string } controlName
   */
  public isInputUpdated(controlName: string): boolean {
    return this.updatedInputs.has(controlName);
  }

  /**
   * Listening to changes:
   * 'data' - re-calculate the total of totals, so we have the correct value
   *
   * @param { SimpleChanges } changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.calculateTotalOfTotals();
    }
  }

  /**
   * Refreshes the updated inputs, by clearing all current updated inputs, and saving new initial values
   */
  public refreshUpdatedInputs(): void {
    // Reset the updated inputs
    this.updatedInputs = new Set();

    // Store the current values, so comparison for later can be made
    this.storeInitialValues();
  }

  /**
   * Calculate the total of totals by summing up all month totals
   */
  public calculateTotalOfTotals(): void {
    this.totalOfTotals = 0;

    // Go through each month and add the month totals
    for(let i = 0; i < 12; i++) {
      this.totalOfTotals += this.monthTotals[i];
    }

    // Round the value to 2 decimals
    this.totalOfTotals = roundValueTo2Decimals(this.totalOfTotals);
  }

  /**
   * When an input changes, emit the event to the parent component and re-calculate the total of totals
   *
   * @param { string } controlName
   */
  public onInputChange(controlName: string): void {
    // Emit the event to parent component
    this.inputChange.emit(controlName);

    // Re-calculate total of totals
    this.calculateTotalOfTotals();

    // Add input to updated inputs
    this.updateInputsSet(controlName);
  }

  /**
   * Checks if updateInputs should be updated, based on the initial and updated value
   *
   * @param { string } controlName
   * @private
   */
  private updateInputsSet(controlName: string): void {
    // Get control with this name
    const control = this.form.get(controlName);

    if (control) {
      // Get the initial and current value of the control
      const initialValue = this.initialValues.get(controlName);
      const currentValue = control.value;

      // Check if the value has changed from the initial value
      if (initialValue !== currentValue) {
        this.updatedInputs.add(controlName); // Mark it as changed
      } else {
        this.updatedInputs.delete(controlName); // Remove from changed if it matches initial value
      }
    }
  }

  protected readonly months = months;
}
