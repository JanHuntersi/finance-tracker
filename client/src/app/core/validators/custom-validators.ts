import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class CustomValidators {
  /**
   * Checks if the written passwords are matching
   *
   * @returns { ValidatorFn }
   */
  public static matchingPasswordsValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;

      // Check if password and password confirmation exists, then check if they are the same
      return password && passwordConfirmation && password !== passwordConfirmation ? { 'mismatch': true } : null;
    };
  }
}
