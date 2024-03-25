import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SSRDirective, UtilsService } from '@notify/nfc-app-services';
import {
  ProfileViewComponent,
  SplineViewerComponent,
} from '@notify/ngx-shared';
import { BasePageComponent } from '../../components/base-page/base-page.component';

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
export class SplashComponent extends BasePageComponent {}
