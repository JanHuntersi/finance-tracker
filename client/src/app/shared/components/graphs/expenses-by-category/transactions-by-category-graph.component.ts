import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {NgIf} from "@angular/common";
import {getTitleFromType, getTypeIdFromString} from "../../../../core/helpers/mapper";

@Component({
  selector: 'transactions-by-category-graph',
  standalone: true,
  imports: [
    CanvasJSAngularChartsModule,
    NgIf
  ],
  templateUrl: './transactions-by-category-graph.component.html',
  styleUrl: './transactions-by-category-graph.component.css'
})
export class TransactionsByCategoryGraphComponent implements OnInit, OnChanges {
  @Input() public transactions: Array<any> = [];
  @Input() public type: string = "expense";

  public availableData: boolean = false;
  public chart: any;

  public chartOptions: any = {
    title: {
      fontSize: 20,
      margin: 20,
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      yValueFormatString: "#,###.##'€'",
      dataPoints: []
    }],
  }

  public ngOnInit(): void {
    this.prepareChartOptions();
    this.prepareChartData();
  }

  /**
   * Save the chart instance when chart is initialized
   *
   * @param { object } chart
   */
  public saveChartInstance(chart: object): void {
    this.chart = chart;
  }

  /**
   * Prepare chart options
   */
  public prepareChartOptions(): void {
    this.chartOptions.title.text = getTitleFromType(this.type);
  }

  /**
   * Group transactions by category, and sum up their amount
   * By default, only transactions from this month are used
   */
  public prepareChartData(): void {
    const categoryMap: Map<number, { name: string, totalAmount: number }> = new Map<number, { name: string, totalAmount: number }>();
    const transactionType: number = getTypeIdFromString(this.type);

    // Filter transactions based on the type, and date of transactions
    this.transactions.forEach(transaction => {
      const isCorrectType: boolean = transaction.type_id === transactionType;
      if (isCorrectType) {
        const categoryId: number = transaction.category_id;
        const amount = transaction.amount;
        const categoryName = transaction.category ? transaction.category.name : 'Unknown';

        // Check if this category already exists, and add the amount to it if it does; otherwise add new category to map
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId)!.totalAmount += amount;
        } else {
          categoryMap.set(categoryId, { name: categoryName, totalAmount: amount });
        }
      }
    });

    this.formatDataForGraph(categoryMap);
  }

  /**
   * Data for graph must be in a specific format:
   * [
   *  {
   *    y: categoryData.totalAmount,
   *    name: categoryData.name
   *  }
   * ]
   *
   * @param { Map<number, { name: string, totalAmount: number }> } categoryMap
   */
  public formatDataForGraph(categoryMap: Map<number, { name: string, totalAmount: number }>): void {
    // Convert map data into format that the chart expects
    const dataPoints: { y: number, name: string }[] = Array.from(categoryMap.values()).map((categoryData: any) => ({
      y: categoryData.totalAmount,
      name: categoryData.name
    }));

    // Set new dataPoints
    this.chartOptions.data[0].dataPoints = dataPoints;

    this.availableData = dataPoints.length > 0;

    if (!this.availableData) {
      this.chart = null;
    }

    if (this.chart) {
      this.chart.render();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.prepareChartData();
    }
  }
}
