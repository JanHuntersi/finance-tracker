import {Component, Input, OnInit} from '@angular/core';
import {AnalyticsSettingsStateService} from "../../../core/services/analytics-settings-state.service";
import {
  CompactCategoryListComponent
} from "../../../shared/components/compact-category-list/compact-category-list.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CategoryTableComponent} from "../../../shared/components/category-table/category-table.component";
import {CategoryByMonthTableComponent} from "../category-by-month-table/category-by-month-table.component";
import {Category} from "../../../core/models/Category";
import {Transaction} from "../../../core/models/Transaction";
import {InformationBoardComponent} from "../information-board/information-board.component";

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    CompactCategoryListComponent,
    MatCheckbox,
    FormsModule,
    MatIcon,
    CategoryTableComponent,
    CategoryByMonthTableComponent,
    InformationBoardComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Input() public categories: Array<Category> = new Array<Category>();
  @Input() public transactions: Array<Transaction> = new Array<Transaction>();

  public lineGraph: boolean = true;
  public barGraph: boolean = true;
  public graphsByCategory: boolean = false;

  public constructor(
    public analyticsSettingsStateService: AnalyticsSettingsStateService
  ) {}

  public ngOnInit() {
    this.lineGraph = this.analyticsSettingsStateService.getShowLineGraphState();
    this.barGraph = this.analyticsSettingsStateService.getShowBarGraphState();
    this.graphsByCategory = this.analyticsSettingsStateService.getGraphsByCategoryState();
  }

  public toggleBarGraph(): void {
    this.analyticsSettingsStateService.toggleBarGraph();
  }

  public toggleLineGraph(): void {
    this.analyticsSettingsStateService.toggleLineGraph();
  }

  public toggleGraphsByCategory(): void {
    this.analyticsSettingsStateService.toggleGraphsByCategory();
  }
}
