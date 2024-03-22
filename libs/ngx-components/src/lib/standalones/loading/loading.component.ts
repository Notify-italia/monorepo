import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppTitleComponent } from '../app-title/app-title.component';

@Component({
  selector: 'notify-loading',
  standalone: true,
  imports: [CommonModule, AppTitleComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
