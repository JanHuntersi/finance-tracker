import {FormGroup} from "@angular/forms";

/**
 * Rounds a form control value to 2 decimals
 */
export function roundFormControlTo2Decimals(form: FormGroup, controlName: string): void {
  // Get control with this name
  const control = form.get(controlName);

  // If control exists, and the value is a number, round its value to 2 decimals
  if (control) {
    let value = parseFloat(control.value);

    // Round the value to 2 decimal places
    if (!isNaN(value)) {
      // Update the value without triggering additional events
      control.setValue(roundValueTo2Decimals(value), { emitEvent: false });
    }
  }
}

/**
 * Rounds a value to 2 decimals
 *
 * @param { number } value
 */
export function roundValueTo2Decimals(value: number): number {
  return Math.round(value * 100) / 100;
}
