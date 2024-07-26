import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  readonly dialog: MatDialog = inject(MatDialog);

  public title: string = "Are you sure you want to do this?";
  public body: string = "";
  public cancelButton: string = "No";
  public confirmButton: string = "Yes";

  /**
   * Open the modal window
   */
  public openModal(): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialog.open(ConfirmationModalComponent);

    return dialogRef.afterClosed().pipe(map(result => !!result));
  }

  protected readonly confirm = confirm;
}
