import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'notify-pull-to-refresh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pull-to-refresh.component.html',
  styleUrl: './pull-to-refresh.component.scss',
})
export class PullToRefreshComponent {}
