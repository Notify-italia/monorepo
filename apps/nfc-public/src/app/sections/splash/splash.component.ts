import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AppTitleComponent,
  ProfileViewComponent,
  SSRBaseComponent,
  SSRDirective,
  SplineViewerComponent,
  UtilsService,
} from '@notify/ngx-shared';
import { FundedByComponent } from '../funded-by/funded-by.component';
import { TrustedByComponent } from '../trusted-by/trusted-by.component';

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
    TrustedByComponent,
  ],
  providers: [UtilsService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent extends SSRBaseComponent {
  private _utilsService = inject(UtilsService);

  public get mockupAssetPath() {
    return this._utilsService.isMobile
      ? '/assets/images/mockup-mobile.png'
      : '/assets/images/mockup-desktop.png';
  }

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
