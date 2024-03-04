import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SSRDirective, UtilsService } from '@notify/nfc-app-services';
import {
  ProfileViewComponent,
  SplineViewerComponent,
} from '@notify/ngx-components';
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
})
export class SplashComponent extends BasePageComponent {
  public isMobile = false;

  public constructor(private _utilsService: UtilsService) {
    super();
    console.log(
      'SplashComponent',
      this._utilsService.currentTailwindMediaQuery()
    );
    this.isMobile = ['none', 'sm', 'md'].includes(
      this._utilsService.currentTailwindMediaQuery()
    );
  }
}
