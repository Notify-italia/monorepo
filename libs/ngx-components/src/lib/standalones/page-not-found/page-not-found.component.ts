import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnimatedBgComponent } from '../animated-bg/animated-bg.component';
import { AppTitleComponent } from '../app-title/app-title.component';

@Component({
  selector: 'notify-page-not-found',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, AnimatedBgComponent],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {}
