import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf} from "@angular/common";
import {getClassBasedOnType} from "../../../core/helpers/mapper";

@Component({
  selector: 'app-compact-transaction-list',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    NgClass
  ],
  templateUrl: './compact-transaction-list.component.html',
  styleUrl: './compact-transaction-list.component.css'
})
export class CompactTransactionListComponent {
  @Input() public transactions: Array<any> = new Array<any>();
  protected readonly getClassBasedOnType = getClassBasedOnType;
}
