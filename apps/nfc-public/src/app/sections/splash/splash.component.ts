import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AppTitleComponent,
  ProfileViewComponent,
  SSRBaseComponent,
  SSRDirective,
  SplineViewerComponent,
  UtilsService,
} from '@notify/ngx-shared';
import { FundedByComponent } from '../funded-by/funded-by.component';

@Component({
  selector: 'notify-splash',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    SSRDirective,
    SplineViewerComponent,
    AppTitleComponent,
    FundedByComponent,
  ],
  providers: [UtilsService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent extends SSRBaseComponent {
  public goToShop() {
    const element = document.getElementById('shop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    return;
  }

  public openCalendlyPopup() {
    window.open(
      'https://calendly.com/notifyitalia/chiacchierata',
      '',
      'popup,left=100,top=100,width=1280,height=700'
    );
  }
}
