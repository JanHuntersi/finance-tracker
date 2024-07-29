import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AbstractControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-transaction-type-select',
  standalone: true,
  imports: [
    NgClass,
    TypePipe,
    MatIcon,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './transaction-type-select.component.html',
  styleUrl: './transaction-type-select.component.css'
})
export class TransactionTypeSelectComponent {
  @Input() public form: FormGroup = new FormGroup({});
  @Input() public clickable: boolean = true;

  /**
   * Set the value of the control
   *
   * @param { number } type
   */
  public selectType(type: number): void {
    if (this.clickable) {
      const control: AbstractControl<any, any> | null = this.form.get('type_id');

      if (control !== null) {
        control.setValue(type);
      }
    }
  }
}
