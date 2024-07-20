import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../../../../core/services/transaction-service.service";
import {AuthService} from "../../../../core/services/auth-service.service";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  public constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  public ngOnInit() {
    this.transactionService.getTransactions(this.authService.user.id).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  public getTransaction() {
    this.transactionService.getTransaction(1).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }
}
