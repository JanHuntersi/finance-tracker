import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'basic-budget-table',
  standalone: true,
  imports: [
    MatIcon,
    MatTable,
    ReactiveFormsModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatFooterCell,
    MatFooterCellDef,
    NgForOf,
    MatFooterRowDef,
    MatHeaderRow,
    MatRow,
    MatFooterRow,
    MatHeaderRowDef,
    MatRowDef,
    JsonPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './basic-budget-table.component.html',
  styleUrl: './basic-budget-table.component.css'
})
export class BasicBudgetTableComponent implements OnInit {
  @Input() public form: FormGroup = new FormGroup({});
  @Input() public data: any = {};
  @Input() public total: number = 0;
  @Input() public selectedType: string = "";

  @Output() public inputChange: EventEmitter<string> = new EventEmitter<string>();

  private updatedInputs: Set<string> = new Set();
  private initialValues: Map<string, any> = new Map();
  public displayedColumns: string[] = ['category', 'amount'];

  public ngOnInit(): void {
    this.storeInitialValues();
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
   * Refreshes the updated inputs, by clearing all current updated inputs, and saving new initial values
   */
  public refreshUpdatedInputs(): void {
    // Reset the updated inputs
    this.updatedInputs = new Set();

    // Store the current values, so comparison for later can be made
    this.storeInitialValues();
  }

  /**
   * When an input changes, emit the event to the parent component and re-calculate the total of totals
   *
   * @param { string } controlName
   */
  public onInputChange(controlName: string): void {
    // Emit the event to parent component
    this.inputChange.emit(controlName);

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
}
