import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css'
})
export class SubmitButtonComponent {
  @Input() public buttonText: string = "Save";
  @Input() public validForm: boolean = false;
}
