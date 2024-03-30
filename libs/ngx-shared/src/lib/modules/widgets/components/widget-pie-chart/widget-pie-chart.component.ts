import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApexNonAxisChartSeries, ApexOptions } from 'ng-apexcharts';
import { SSRDirective } from '../../../../directives';
import { ApexChartSsrComponent } from '../../../../standalones/apex-chart-ssr/apex-chart-ssr.component';

@Component({
  selector: 'notify-widget-pie-chart',
  standalone: true,
  imports: [CommonModule, SSRDirective, ApexChartSsrComponent],
  templateUrl: './widget-pie-chart.component.html',
  styleUrls: ['./widget-pie-chart.component.scss', '../../widgets.styles.scss'],
})
export class WidgetPieChartComponent {
  @Input() title: string = '';
  @Input() series: ApexNonAxisChartSeries = [];
  @Input() disableExport = false;
  @Input() legendValues: string[] = [];

  public backgroundColor = 'transparent';

  public chartConfig: ApexOptions = {
    noData: {
      text: 'Nessun dato visualizzabile',
      style: {
        color: '#ffffff',
      },
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
      height: 225,
      toolbar: {
        show: true,
      },
      animations: {
        enabled: true,
      },
    },
    stroke: {
      show: true,
      width: 3,
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
              fontWeight: 600,
              color: '#ffffff',
              offsetY: 25,
            },
            total: {
              show: true,
              label: 'Totale',
              fontSize: '12px',
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

  public get chartOptions(): ApexOptions {
    if (!this.chartConfig.chart?.toolbar) {
      return this.chartConfig;
    }

    this.chartConfig.chart.toolbar.show = !this.disableExport;

    return {
      ...this.chartConfig,
      series: this.series,
      labels: this.legendValues,
    };
  }
}
