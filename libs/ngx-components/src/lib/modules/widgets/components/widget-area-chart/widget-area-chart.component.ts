import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { INotifyStat } from '@notify/interfaces';
import {
  differenceInDays,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ApexChartSsrComponent } from '../../../../standalones/apex-chart-ssr/apex-chart-ssr.component';

import { UtilsService } from '@notify/nfc-app-services';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexOptions,
  ApexStroke,
} from 'ng-apexcharts';

export const AREA_CHART_DEFAULT_PERIOD = {
  from: startOfDay(subWeeks(new Date(), 1)),
  to: endOfDay(new Date()),
};

@Component({
  selector: 'notify-widget-area-chart',
  standalone: true,
  imports: [CommonModule, ApexChartSsrComponent],
  providers: [UtilsService],
  templateUrl: './widget-area-chart.component.html',
  styleUrls: [
    './widget-area-chart.component.scss',
    '../../widgets.styles.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAreaChartComponent {
  @Input() public title = '';
  @Input() public series: ApexAxisChartSeries = [];
  @Input() disableExport = false;

  @Input() public timespans: { label: string; value: INotifyStat['period'] }[] =
    DEFAULT_TIMESPANS;
  @Input() public selectedTimespan: (typeof this.timespans)[0] =
    this.timespans[0];

  @Output() public timespanChange = new EventEmitter<INotifyStat['period']>();

  public backgroundColor = 'transparent';

  public constructor(private _utilsService: UtilsService) {}

  public get chartOptions(): ApexOptions {
    return {
      noData: {
        text: 'Nessun dato visualizzabile',
      },
      fill: DEFAULT_FILL,

      stroke: DEFAULT_STROKE,

      grid: {
        borderColor: '#7573f0',
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },

      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
        y: {
          formatter: (value) => value.toFixed(0),
        },
      },
      chart: {
        ...DEFAULT_CHART,
        toolbar: {
          show: !this.disableExport,
          offsetX: -10,
          offsetY: -10,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      xaxis: {
        type: 'category',
        labels: {
          show: true,
          style: {
            colors: '#9E9E9E',
          },
          datetimeUTC: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: '#9E9E9E',
          },
        },
      },
      series: this.enrichedSeries,
    };
  }

  public get enrichedSeries() {
    return this.enrichSeries();
  }

  public enrichSeries(): ApexAxisChartSeries {
    //fill the series with the missing dates, the data is assumed to be of type {x: Date, y: number}

    //create an array of dates from the first to the last date in the series
    const dates = this.series[0].data.map((d) =>
      this._utcFix((d as { x: Date })?.x)
    );

    //get the selected timespan and compare it with the dates array to get the missing dates in the series as an array of dates
    const missingDates: { x: Date; y: number }[] = this._getMissingDates(
      dates,
      this.selectedTimespan.value
    ).map((date) => ({ x: date, y: 0 }));

    //add the missing dates to the series and sort it
    const enrichedSeries = this.series[0].data
      .map((d) => ({
        x: (d as { x: Date })?.x,
        y: Number((d as { y: number })?.y),
      }))
      .concat(missingDates)
      .sort(
        (a, b) =>
          (a as { x: Date })?.x.getTime() - (b as { x: Date })?.x.getTime()
      )
      .map((d) => ({
        x: format((d as { x: Date })?.x, 'dd MMM '),
        y: Number((d as { y: number })?.y),
      }))
      .reduce((acc: { x: string; y: number }[], curr) => {
        const index = acc.findIndex((v) => v.x === curr.x);

        if (index === -1) {
          return [...acc, curr];
        }

        acc[index].y += curr.y;

        return acc;
      }, []);

    console.log('enrichedSeries', enrichedSeries);

    return [{ name: 'Visite', data: enrichedSeries }];
  }

  public prepareSelectValue(item: (typeof DEFAULT_TIMESPANS)[0]): string {
    return JSON.stringify(item);
  }

  public handleTimespanChange(timespan: (typeof this.timespans)[0]) {
    const _t = JSON.parse(timespan as unknown as string);
    _t.value = {
      from: new Date(_t.value.from),
      to: new Date(_t.value.to),
    };
    this.selectedTimespan = _t;
    this.timespanChange.emit(_t.value);
  }

  private _getMissingDates(
    dates: Date[],
    timespan: INotifyStat['period']
  ): Date[] {
    const from = timespan.from;
    const to = timespan.to;

    const difference = differenceInDays(to, from);

    //starting from the first date in the series, create an array of dates with the same length as the difference between the first and the last date in the series
    const allDatesInTimeSpan = Array.from({ length: difference }, (_, i) => {
      return subDays(new Date(to), i);
    });

    const missingDates = allDatesInTimeSpan.filter(
      (date) =>
        !dates.find(
          (d) => format(d, 'dd MMM yyyy') === format(date, 'dd MMM yyyy')
        )
    );

    return missingDates;
  }

  private _utcFix(d: Date): Date {
    //remove the timezone offset from the date
    return this._utilsService.compensateUTCDate(d);
  }
}

const DEFAULT_FILL: ApexFill = {
  type: 'gradient',
  gradient: {
    shadeIntensity: 0,
    opacityFrom: 0.9,
    opacityTo: 0,
    // colorStops: [0, 100],
  },
  colors: ['#74EAB3'],
};

const DEFAULT_STROKE: ApexStroke = {
  curve: 'smooth',
  dashArray: 0,
  colors: ['#74EAB3'],
};

const DEFAULT_CHART: ApexChart = {
  type: 'area',
  height: '100%',
  width: '100%',
  redrawOnParentResize: true,
  redrawOnWindowResize: true,
  defaultLocale: 'it',
  locales: [
    {
      name: 'it',
      options: {
        months: [
          'Gennaio',
          'Febbraio',
          'Marzo',
          'Aprile',
          'Maggio',
          'Giugno',
          'Luglio',
          'Agosto',
          'Settembre',
          'Ottobre',
          'Novembre',
          'Dicembre',
        ],
      },
    },
  ],
  sparkline: {
    enabled: false,
  },

  animations: {
    enabled: true,
    easing: 'easeinout',
  },
};

const td = new Date();

const DEFAULT_TIMESPANS = [
  {
    label: 'Ultima settimana',
    value: {
      from: startOfDay(subWeeks(td, 1)),
      to: endOfDay(td),
    },
  },
  {
    label: 'Ultimo mese',
    value: {
      from: startOfDay(subMonths(td, 1)),
      to: endOfDay(td),
    },
  },
  {
    label: 'Ultimi 3 mesi',
    value: {
      from: startOfDay(subMonths(td, 3)),
      to: endOfDay(td),
    },
  },
];
