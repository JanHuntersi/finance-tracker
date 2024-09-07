import {Component, OnInit} from '@angular/core';
import {BudgetService} from "../../../../core/services/budget.service";
import {NgClass, NgIf} from "@angular/common";
import {AdvancedBudgetFormComponent} from "../../../budgets/advanced-budget-form/advanced-budget-form.component";
import {BasicBudgetFormComponent} from "../../../budgets/basic-budget-form/basic-budget-form.component";
import {CategoryService} from "../../../../core/services/category.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [
    NgIf,
    AdvancedBudgetFormComponent,
    BasicBudgetFormComponent,
    NgClass
  ],
  templateUrl: './budgets-page.component.html',
  styleUrl: './budgets-page.component.css'
})
export class BudgetsPageComponent implements OnInit {
  public budget: Array<any> = new Array<any>();
  public simplifiedBudget: any = {};
  public showAdvanced: boolean = false;
  public editing: boolean = false;
  public categories: Array<any> = new Array<any>();
  public formUpdated: boolean = false;
  public showSetupPrompt: boolean = true;

  public constructor(
    public dialogRef: MatDialog,
    public budgetService: BudgetService,
    public categoryService: CategoryService,
  ) {}

  public ngOnInit() {
    this.getBudget();
  }

  /**
   * Get user budget
   */
  public getBudget(): void {
    this.budgetService.getUserBudget().subscribe({
      next: (response: any) => {
        this.budget = response.data.budget;
        this.showAdvanced = response.data.advanced;
        this.editing = this.budget.length > 0;

        this.getCategories();
      }
    })
  }

  /**
   * Get user categories
   */
  public getCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;

        this.simplifyBudget();
      }
    });
  }

  /**
   * Toggle between basic and advanced budget form, and show a modal window if changes happened before toggle
   *
   * @param { boolean } showAdvanced
   */
  public toggleAdvanced(showAdvanced: boolean): void {
    if (this.formUpdated) {
      const dialogRef: MatDialogRef<ConfirmationModalComponent> = this.dialogRef.open(ConfirmationModalComponent);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.showAdvanced = showAdvanced;
          this.formUpdated = false;
        }
      });
    } else {
      this.showAdvanced = showAdvanced;
      this.formUpdated = false;
      this.showSetupPrompt = false;
    }
  }

  /**
   * Listen to budget forms, if an update happened, so a modal window is opened if needed
   *
   * @param { boolean } updated
   */
  public onFormUpdate(updated: boolean): void {
    this.formUpdated = updated;
  }

  /**
   * Before giving budget information to 'basic-budget-form' component, simplify the budget, by summing up the amounts
   * and dividing it by 12, to get the average value for each month
   */
  public simplifyBudget(): void {
    // Group the budget by category_id, and sum up the amount
    const simplifiedBudget: any = [];
    this.budget.forEach((budget: any) => {
      if (simplifiedBudget[budget.category_id]) {
        simplifiedBudget[budget.category_id] += budget.amount;
      } else {
        simplifiedBudget[budget.category_id] = budget.amount;
      }
    });

    // Get the average amount of each category
    simplifiedBudget.forEach((budget: any, index: number) => {
      simplifiedBudget[index] = (budget / 12).toFixed(2);
    });

    // Create a simplified budget, but keep the 'budget_id' for saving
    this.simplifiedBudget = {
      'id': this.budget[0]?.budget_id ?? null,
      'budget': simplifiedBudget,
    };
  }
}
