import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ProfileViewComponent,
  SSRBaseComponent,
  SSRDirective,
  SplineViewerComponent,
  UtilsService,
} from '@notify/ngx-shared';

@Component({
  selector: 'notify-splash',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    SSRDirective,
    SplineViewerComponent,
  ],
  providers: [UtilsService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent extends SSRBaseComponent {}
