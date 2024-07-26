import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {AbstractControl, FormGroup} from "@angular/forms";
import {TypePipe} from "../../../core/pipes/type-pipe.pipe";

@Component({
  selector: 'app-transaction-type-select',
  standalone: true,
  imports: [
    NgClass,
    TypePipe
  ],
  templateUrl: './transaction-type-select.component.html',
  styleUrl: './transaction-type-select.component.css'
})
export class TransactionTypeSelectComponent {
  @Input() public form: FormGroup = new FormGroup({});
  @Input() public clickable: boolean = true;

  public selectType(type: number): void {
    if (this.clickable) {
      const control: AbstractControl<any, any> | null = this.form.get('type_id');

      if (control !== null) {
        control.setValue(type);
      }
    }
  }
}
