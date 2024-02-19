import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PixelService } from '@notify/nfc-app-services';
import { LoadingComponent } from '@notify/ngx-components';
import { Subject, combineLatest, tap } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { FeaturesComponent } from '../features/features.component';
import { InstructionsComponent } from '../instructions/instructions.component';
import { PartnersComponent } from '../partners/partners.component';
import { SplashComponent } from '../splash/splash.component';

@Component({
  selector: 'notify-home',
  standalone: true,
  imports: [
    CommonModule,
    TopNavComponent,
    SplashComponent,
    FeaturesComponent,
    FooterComponent,
    LoadingComponent,
    ContactUsComponent,
    PartnersComponent,
    InstructionsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public splashSable$ = new Subject<void>();
  public instructionsStable$ = new Subject<void>();

  public pageStable$ = combineLatest([
    this.splashSable$,
    this.instructionsStable$,
  ]).pipe(tap(() => console.log('pageStable$')));

  constructor(private _pixel: PixelService) {
    this._pixel.track('ViewContent');
  }
}
