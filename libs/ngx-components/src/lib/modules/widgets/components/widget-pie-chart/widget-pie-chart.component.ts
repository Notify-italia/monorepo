import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'notify-widget-pie-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './widget-pie-chart.component.html',
  styleUrls: ['./widget-pie-chart.component.scss', '../../widgets.styles.scss'],
})
export class WidgetPieChartComponent {
  @Input() title: string = '';
  @Input() series: ApexNonAxisChartSeries = [];
  @Input() legendValues: string[] = [];

  public backgroundColor = 'transparent';

  public chartConfig: ApexOptions = {
    noData: {
      text: 'Nessun dato visualizzabile',
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        useSeriesColors: true,
      },
    },
    chart: {
      type: 'donut',
      height: 350,
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      width: 8,
      colors: ['#1E222A'],
    },

    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '82%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Roboto, sans-serif',
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '52px',
              fontFamily: 'Roboto, sans-serif',
              color: '#ffffff',
              offsetY: 25,
            },
            total: {
              show: true,
              label: 'Totale',
              color: '#ffffff',
              fontWeight: 'bold',
              formatter: function (w: { globals: { seriesTotals: number[] } }) {
                return w.globals.seriesTotals
                  .reduce((a: number, b: number) => {
                    return a + b;
                  }, 0)
                  .toFixed(0);
              },
            },
          },
        },
      },
    },
  };
}
