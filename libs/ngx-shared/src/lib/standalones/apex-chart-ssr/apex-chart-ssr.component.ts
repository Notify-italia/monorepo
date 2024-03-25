import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts-lazy';

@Component({
  selector: 'notify-apex-chart-ssr',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './apex-chart-ssr.component.html',
  styleUrl: './apex-chart-ssr.component.scss',
})
export class ApexChartSsrComponent {
  @Input() chartOptions?: ApexOptions;
}
