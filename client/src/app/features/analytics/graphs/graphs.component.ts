import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {NgIf} from "@angular/common";
import {AnalyticsSettingsStateService} from "../../../core/services/analytics-settings-state.service";
import {AnalyticsGraph} from "../analytics-graph/analytics-graph.component";
import {Transaction} from "../../../core/models/Transaction";
import {categorizeBudgetByType} from "../../../core/helpers/transactions";
import {months} from "../../../core/config/months";
import {Category} from "../../../core/models/Category";

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [
    CanvasJSAngularChartsModule,
    NgIf,
    AnalyticsGraph
  ],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.css'
})
export class GraphsComponent implements OnInit, OnChanges {
  @Input() public categories: Array<Category> = new Array<Category>();
  @Input() public transactions: Array<Transaction> = new Array<Transaction>();

  private expenses: Array<Transaction> = new Array<Transaction>();
  private incomes: Array<Transaction> = new Array<Transaction>();
  private savings: Array<Transaction> = new Array<Transaction>();
  public selectedCategories: Array<Category> = new Array<Category>();
  public showBarGraph: boolean = true;
  public showLineGraph: boolean = true;
  public graphsByCategory: boolean = false;
  public data: any = {};

  public constructor(
    public analyticsSettingsStateService: AnalyticsSettingsStateService
  ) {}

  public ngOnInit() {
    this.getGraphStates();
    this.prepareChartData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.categorizeBudgetByType();
      this.prepareChartData();
    }
  }

  /**
   * Subscribes to state observables to get the current state for displaying graphs
   */
  private getGraphStates(): void {
    this.analyticsSettingsStateService.showBarGraphState$.subscribe((state: boolean) => {
      this.showBarGraph = state;
    });

    this.analyticsSettingsStateService.showLineGraphState$.subscribe((state: boolean) => {
      this.showLineGraph = state;
    });

    this.analyticsSettingsStateService.graphsByCategoryState$.subscribe((state: boolean) => {
      this.graphsByCategory = state;
    });

    this.analyticsSettingsStateService.selectedCategoriesState$.subscribe((selectedCategories: Array<Category>) => {
      this.selectedCategories = selectedCategories;
    });
  }

  /**
   * Categorizes budget by type, and returns separate arrays
   */
  private categorizeBudgetByType(): void {
    // Categorize budget by type
    const { expenses, incomes, savings } = categorizeBudgetByType(this.transactions);

    // Set categorized budget
    this.expenses = expenses;
    this.incomes = incomes;
    this.savings = savings;
  }

  /**
   * Prepares chart data by calculating month totals for each month
   */
  public prepareChartData(): void {
    let availableData: boolean = true;

    if (this.transactions.length === 0) {
      availableData = false;
    }

    if (this.graphsByCategory) {
      this.prepareChartDataByCategory(availableData);
    } else {
      this.prepareChartDataByType(availableData);
    }
  }

  private prepareChartDataByCategory(availableData: boolean): void {
    // Get all selected categories
    // Create a data element for each selected category
    // Go through all transactions, and check if they have the selected category
    // If they do, sum up by months
    const categories: Array<Category> = this.selectedCategories.length === 0 ? this.categories : this.selectedCategories;

    // Initialize a temporary structure to hold data
    const tempData: { [categoryId: number]: number[] } = {};

    categories.forEach((category: Category) => {
        tempData[category.id] = Array<number>(12).fill(0);
    });

    this.transactions.forEach((transaction: Transaction) => {
      // Get category of transaction if it exists
      const category: Category | undefined = transaction.category;

      // Get month of transaction
      const month: number = new Date(transaction.date).getMonth();

      if (category) {
        const categoryId: number = category.id;

        if (tempData[categoryId]) {
          tempData[categoryId][month] += transaction.amount;
        }
      }
    });

    // Create an interface for the data
    interface GraphData {
      type: number,
      id: number,
      name: string,
      showInLegend: boolean,
      dataPoints: Array<{ label: string, y: number }>
    }

    const graphData: Array<GraphData> = categories.map((category: Category) => ({
        type: category.type_id,
        id: category.id,
        name: category.name,
        showInLegend: true,
        dataPoints: tempData[category.id].map((dataPoint: number, index: number) => ({
          label: months[index],
          y: dataPoint
        })),
      })
    );

    this.data = {
      available: availableData,
      data: graphData,
    }
  }

  private prepareChartDataByType(availableData: boolean): void {
    // Create an interface for the data
    interface DataPoint {
      label: string,
      y: number,
    }

    // Prepare data points for each category
    const incomeDataPoints: Array<DataPoint> = new Array<DataPoint>();
    const expenseDataPoints: Array<DataPoint> = new Array<DataPoint>();
    const savingsDataPoints: Array<DataPoint> = new Array<DataPoint>();

    // Calculate month totals for the whole year
    for(let month = 0; month < 12; month++) {
      const monthTotalIncomes = this.incomes
        .filter((income: Transaction) => new Date(income.date).getMonth() === month)
        .reduce((total: number, income: any) => total + income.amount, 0);

      const monthTotalExpenses = this.expenses
        .filter((expense: Transaction) => new Date(expense.date).getMonth() === month)
        .reduce((total: number, expense: any) => total + expense.amount, 0);

      const monthTotalSavings = this.savings
        .filter((saving: Transaction) => new Date(saving.date).getMonth() === month)
        .reduce((total: number, saving: any) => total + saving.amount, 0);

      incomeDataPoints.push({ label: months[month], y: monthTotalIncomes });
      expenseDataPoints.push({ label: months[month], y: monthTotalExpenses });
      savingsDataPoints.push({ label: months[month], y: monthTotalSavings });
    }

    // Create graph data
    this.data = {
      available: availableData,
      data: [
        {
          type: "",
          name: "Incomes",
          showInLegend: true,
          yValueFormatString: "#,###0€ received",
          dataPoints: incomeDataPoints,
          color: "#25a957",
        }, {
          type: "",
          name: "Expenses",
          showInLegend: true,
          yValueFormatString: "#,###0€ spent",
          dataPoints: expenseDataPoints,
          color: "#d02323",
        }, {
          type: "",
          name: "Savings",
          showInLegend: true,
          yValueFormatString: "#,###0€ saved",
          dataPoints: savingsDataPoints,
          color: "#2754dc",
        }
      ]
    }
  }
}
