import { Component } from '@angular/core';
import {TransactionWrapperComponent} from "../../transactions/transaction-wrapper/transaction-wrapper.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    TransactionWrapperComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
