import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Transaction} from "../../../core/models/Transaction";

@Component({
  selector: 'app-saving-transactions-list',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './saving-transactions-list.component.html',
  styleUrl: './saving-transactions-list.component.css'
})
export class SavingTransactionsListComponent {
  @Input() public transactions: Array<Transaction> = new Array<Transaction>();
}
