import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {CurrencyPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-spending-by-date',
  standalone: true,
  imports: [
    CanvasJSAngularChartsModule,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './spending-by-date.component.html',
  styleUrl: './spending-by-date.component.css'
})
export class SpendingByDateComponent implements OnInit, OnChanges {
  @Input() public transactions: Array<any> = [];

  public totalExpense: number = 0;
  public totalIncome: number = 0;
  public totalSavings: number = 0;
  public availableData: boolean = true;
  public chart: any;

  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: ""
    },
    axisX: {
      intervalType: "",
      interval: 1
    },
    axisY: {
      title: "Amount",
      suffix: "€"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function(e: any){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else{
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
      type: "line",
      name: "Expense",
      showInLegend: true,
      yValueFormatString: "#,###0€ spent",
      lineThickness: 2,
      smooth: true,
      dataPoints: []
    }, {
      type: "line",
      name: "Income",
      showInLegend: true,
      yValueFormatString: "#,###0€ received",
      dataPoints: []
    }, {
      type: "line",
      name: "Savings",
      showInLegend: true,
      yValueFormatString: "#,###0€ saved",
      dataPoints: []
    }]
  }

  /**
   * Save the chart instance when chart is initialized
   *
   * @param { object } chart
   */
  public saveChartInstance(chart: object): void {
    this.chart = chart;
  }

  public ngOnInit(): void {
    this.prepareChart();
  }

  /**
   * Figure out the interval type that needs to be used on this chart, then sum up amount of transactions by type and
   * interval.
   */
  public prepareChart(): void {
    // Ensure transactions are sorted by date (latest first)
    const transactionsSorted: any[] = this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.totalExpense = 0;
    this.totalIncome = 0;
    this.totalSavings = 0;

    this.availableData = transactionsSorted.length > 0;

    if (!this.availableData) {
      this.chart = null;
      return;
    }

    // Get start and end date of the transactions. Oldest transactions are at the end, so fetch at last index (-1)
    const startDate: Date = new Date(transactionsSorted.at(-1).date);
    const endDate: Date = new Date(transactionsSorted[0].date);

    // Calculate the difference in days between the first and last transaction
    const dayDifference: number = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine the interval type
    const intervalType: string = this.getIntervalType(dayDifference);

    // Prepare data points for each category
    const expenseDataPoints: any[] = [];
    const incomeDataPoints: any[] = [];
    const savingsDataPoints: any[] = [];

    // Initialize variables for grouping
    let currentGroupStartDate: Date = new Date(startDate);
    let groupEndDate: Date;

    // Group transactions by interval and create data points
    while (currentGroupStartDate <= endDate) {
      groupEndDate = this.getGroupEndDate(currentGroupStartDate, intervalType)

      // Calculate the total amounts for each category within the current group
      let totalExpense: number = 0
      let totalIncome: number = 0
      let totalSavings: number = 0;

      // Sum up the amounts of each transaction type
      this.transactions.forEach(transaction => {
        const transactionDate: Date = new Date(transaction.date);
        if (transactionDate >= currentGroupStartDate && transactionDate < groupEndDate) {
          if (transaction.type_id === 1) totalExpense += transaction.amount;
          if (transaction.type_id === 2) totalIncome += transaction.amount;
          if (transaction.type_id === 3) totalSavings += transaction.amount;
        }
      });

      // Add data points for each category
      if (intervalType !== "year" || (intervalType === "year" && groupEndDate.getFullYear() !== startDate.getFullYear())) {
        expenseDataPoints.push({ x: currentGroupStartDate, y: totalExpense });
        incomeDataPoints.push({ x: currentGroupStartDate, y: totalIncome });
        savingsDataPoints.push({ x: currentGroupStartDate, y: totalSavings });
      }

      this.totalExpense += totalExpense;
      this.totalIncome += totalIncome;
      this.totalSavings += totalSavings;

      // Move to the next group
      currentGroupStartDate = this.addDays(groupEndDate, 1);
    }

    // Update chart options with the prepared data points
    this.chartOptions.data[0].dataPoints = expenseDataPoints
    this.chartOptions.data[1].dataPoints = incomeDataPoints;
    this.chartOptions.data[2].dataPoints = savingsDataPoints;

    // Update axisX intervalType based on the calculated interval
    this.chartOptions.axisX.intervalType = intervalType;

    this.chartOptions.title.text = `Transactions by ${intervalType}`;

    if (this.chart) {
      this.chart.render();
    }
  }

  /**
   * Get interval for the graph, based on the day difference between the oldest and newest transaction
   *
   * @param { number } dayDifference
   */
  public getIntervalType(dayDifference: number): string {
    let intervalType: string = "";
    if (dayDifference < 31) {
      intervalType = "week";
    } else if (dayDifference < 365) {
      intervalType = "month";
    } else {
      intervalType = "year";
    }

    return intervalType;
  }

  /**
   * Get end date for this group of transactions, calculate it from start date and interval type
   *
   * @param { Date } currentGroupStartDate
   * @param { string } intervalType
   */
  public getGroupEndDate(currentGroupStartDate: Date, intervalType: string): Date {
    let groupEndDate: Date;

    // Determine the end date for the current group
    if (intervalType === "week") {
      groupEndDate = this.addDays(currentGroupStartDate, 7);
    } else if (intervalType === "month") {
      groupEndDate = new Date(currentGroupStartDate.getFullYear(), currentGroupStartDate.getMonth() + 1, 0);
    } else {
      groupEndDate = new Date(currentGroupStartDate.getFullYear() + 1, 0, 0);
    }

    return groupEndDate;
  }

  /**
   * Add days to provided date
   *
   * @param { Date } date
   * @param { number } days
   */
  public addDays (date: Date, days: number): Date {
    let result: Date = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.prepareChart();
    }
  }
}
