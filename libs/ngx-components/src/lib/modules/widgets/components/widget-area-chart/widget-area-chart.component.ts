import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'notify-widget-area-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './widget-area-chart.component.html',
  styleUrls: [
    './widget-area-chart.component.scss',
    '../../widgets.styles.scss',
  ],
})
export class WidgetAreaChartComponent implements OnInit, OnChanges {
  @Input() public title = '';
  @Input() public series: ApexAxisChartSeries = [];

  @Input() public timespans: { label: string; value: INotifyStat['period'] }[] =
    DEFAULT_TIMESPANS;
  @Input() public selectedTimespan: (typeof this.timespans)[0] =
    this.timespans[0];

  @Output() public timespanChange = new EventEmitter<INotifyStat['period']>();

  public enrichedSeries: ApexAxisChartSeries = [];

  public chartConfig = {
    noData: {
      text: 'Nessun dato visualizzabile',
    },
    fill: DEFAULT_FILL,
    chart: DEFAULT_CHART,
    stroke: DEFAULT_STROKE,
  };

  public ngOnInit(): void {
    this.enrichedSeries = this.enrichSeries();
  }

  public ngOnChanges(): void {
    this.enrichedSeries = this.enrichSeries();
  }

  public enrichSeries(): ApexAxisChartSeries {
    //fill the series with the missing dates, the data is assumed to be of type {x: Date, y: number}

    //create an array of dates from the first to the last date in the series
    const dates = this.series[0].data.map((d) => (d as { x: Date })?.x);

    //get the selected timespan and compare it with the dates array to get the missing dates in the series as an array of dates
    const missingDates: { x: Date; y: number }[] = this._getMissingDates(
      dates,
      this.selectedTimespan.value
    ).map((date) => ({ x: date, y: 0 }));

    //add the missing dates to the series and sort it
    const enrichedSeries = this.series[0].data
      .concat(missingDates)
      .sort(
        (a, b) =>
          (a as { x: Date })?.x.getTime() - (b as { x: Date })?.x.getTime()
      )
      .map((d) => ({
        x: format((d as { x: Date })?.x, 'dd MMM'),
        y: (d as { y: number })?.y,
      }));

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
}

const DEFAULT_FILL: ApexFill = {
  type: 'gradient',
  gradient: {
    shadeIntensity: 0,
    opacityFrom: 0.9,
    opacityTo: 0,
    stops: [0, 100],
  },
};

const DEFAULT_STROKE: ApexStroke = {
  curve: 'smooth',
  dashArray: 20,
};

const DEFAULT_CHART: ApexChart = {
  type: 'area',
  height: `100%`,
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
    enabled: true,
  },
  toolbar: {
    show: true,
    offsetX: -10,
    offsetY: -10,
  },
  animations: {
    enabled: false,
    easing: 'easeinout',
  },
};

const DEFAULT_TIMESPANS = [
  {
    label: 'Ultima settimana',
    value: {
      from: startOfDay(subWeeks(new Date(), 1)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Ultimo mese',
    value: {
      from: startOfDay(subMonths(new Date(), 1)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Ultimi 3 mesi',
    value: {
      from: startOfDay(subMonths(new Date(), 3)),
      to: endOfDay(new Date()),
    },
  },
];
