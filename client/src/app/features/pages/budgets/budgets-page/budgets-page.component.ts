import {Component, OnInit} from '@angular/core';
import {BudgetService} from "../../../../core/services/budget.service";
import {NgClass, NgIf} from "@angular/common";
import {DetailedBudgetFormComponent} from "../../../budgets/detailed-budget-form/detailed-budget-form.component";
import {BasicBudgetFormComponent} from "../../../budgets/basic-budget-form/basic-budget-form.component";
import {CategoryService} from "../../../../core/services/category.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/confirmation-modal/confirmation-modal.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [
    NgIf,
    DetailedBudgetFormComponent,
    BasicBudgetFormComponent,
    NgClass,
    MatIcon
  ],
  templateUrl: './budgets-page.component.html',
  styleUrl: './budgets-page.component.css'
})
export class BudgetsPageComponent implements OnInit {
  public budget: Array<any> = new Array<any>();
  public categories: Array<any> = new Array<any>();
  public simplifiedBudget: any = {};
  public editing: boolean = false;
  public formUpdated: boolean = false;
  public showAdvanced: boolean = false;
  public loading: boolean = true;

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
        // Save the budget
        this.budget = response.data.budget;
        this.editing = response.data.budget.length > 0;
        this.showAdvanced = response.data.type;
        this.loading = false;

        // Get user categories
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
        // Save the categories
        this.categories = response.data.categories;

        // Simplify the budget for the simple form
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
    // If user is on 'detailed form', and they press on the 'detailed form', we do not want anything to happen
    if (this.showAdvanced !== showAdvanced) {
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
      }
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
    const budgetAmounts: Array<number> = [];

    // If user is editing (budget exists), so get the average values, otherwise set amount to 0 for each category
    if (this.editing) {
      // Group the budget by category_id, and sum up the amount
      this.budget.forEach((budget: any) => {
        if (budgetAmounts[budget.category_id]) {
          budgetAmounts[budget.category_id] += budget.amount;
        } else {
          budgetAmounts[budget.category_id] = budget.amount;
        }
      });
    } else {
      this.categories.forEach((category: any) => {
        budgetAmounts[category.id] = 0;
      });
    }

    // Get the average amount of each category
    budgetAmounts.forEach((budget: any, index: number) => {
      budgetAmounts[index] = Number((budget / 12).toFixed(2));
    });

    const simplifiedBudget: any = [];

    // Create a budget entry for each budget amount
    budgetAmounts.forEach((amount: any, index: number) => {
      // Find the category with this index
      const category: any = this.categories.find((c: any) => c.id === index);

      // Add the found category with the relevant information
      simplifiedBudget.push({
        'id': category.id,
        'name': category.name,
        'icon': category.icon,
        'type': category.type_id,
        'amount': amount || 0,
      });
    });

    // Create the simplified budget
    this.simplifiedBudget = {
      'id': this.budget[0]?.budget_id ?? null,
      'budget': simplifiedBudget,
    };
  }
}
