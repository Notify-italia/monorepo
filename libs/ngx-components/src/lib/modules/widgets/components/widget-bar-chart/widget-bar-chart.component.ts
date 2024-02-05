import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'notify-widget-bar-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './widget-bar-chart.component.html',
  styleUrls: ['./widget-bar-chart.component.scss', '../../widgets.styles.scss'],
})
export class WidgetBarChartComponent {
  @Input() public title = '';
  @Input() public series: ApexAxisChartSeries = [];

  public chartConfig: ApexOptions = {
    noData: {
      text: 'Nessun dato visualizzabile',
    },
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
        barHeight: '10%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: '#fff',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val + ' views';
        },
      },
    },
  };
}
