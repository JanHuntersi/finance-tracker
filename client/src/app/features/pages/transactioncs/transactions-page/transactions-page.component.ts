import { Component } from '@angular/core';
import {TransactionWrapperComponent} from "../../../transactions/transaction-wrapper/transaction-wrapper.component";

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    TransactionWrapperComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent {

}
