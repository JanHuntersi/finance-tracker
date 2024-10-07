import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {NgIf} from "@angular/common";

@Component({
  selector: 'analytics-graph',
  standalone: true,
  imports: [
    CanvasJSAngularChartsModule,
    NgIf
  ],
  templateUrl: './analytics-graph.component.html',
  styleUrl: './analytics-graph.component.css'
})
export class AnalyticsGraph implements OnInit, OnChanges {
  @Input() public title: string = "";
  @Input() public graphType: string = "";
  @Input() public data: any = {};

  public chart: any;

  public chartOptions: any = {
    animationEnabled: true,
    title: {
      text: ""
    },
    axisX: {
      intervalType: "month",
      interval: 1
    },
    axisY: {
      title: "Amount",
      suffix: "€"
    },
    toolTip: {
      shared: true
    },
    data: []
  }

  public ngOnInit() {
    this.renderGraph();
  }

  public setChartOptions(): void {
    this.setGraphType();
    this.setTypeToChart();
  }

  public setGraphType(): void {
    this.chartOptions.data.forEach((data: any) => {
      data.type = this.graphType;
    });
  }

  public setData(): void {
    this.chartOptions.data = this.data['data'];
  }

  public setTypeToChart(): void {
    this.chartOptions.title.text = this.title;
  }

  /**
   * Listens to 'graphData' changes, and re-renders the graph
   *
   * @param { SimpleChanges } changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.renderGraph();
    }
  }

  /**
   * Renders graph if data is available
   */
  public renderGraph(): void {
    // If data is not available, do not display anything
    if (!this.data['available']) {
      this.chart = null;
      return;
    }

    // Set the graph data
    this.setData();

    // Set chart options after 'setData()', because 'setData()' sets new 'data' property
    this.setChartOptions();

    // Render the chart
    if (this.chart) {
      this.chart.render();
    }
  }

  /**
   * Save the chart instance when chart is initialized
   *
   * @param { object } chart
   */
  public saveChartInstance(chart: object): void {
    this.chart = chart;
  }
}
