import { Injectable } from '@angular/core';
import { Transaction } from "../models/Transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionStateService {
  /**
   * Transaction components are very intertwined, because we need to toggle forms for adding/editing based on the status
   * and handling this via @Input()/@Output() was a nightmare.
   *
   * Now they share this class, and update its properties when a state changes.
   */
  public adding: boolean = false;
  public editing: boolean = false;
  public formChanged: boolean = false;
  public selectedTransaction: Transaction | null = null;

  public onCancel(): void {
    this.adding = false;
    this.editing = false;
    this.formChanged = false;
  }

  public openEditForm(): void {
    this.adding = false;
    this.editing = true;
    this.formChanged = false;
  }

  public toggleAddForm(status: boolean): void {
    this.adding = status;
    this.editing = false;
    this.formChanged = false;
    this.selectedTransaction = null;
  }
}
