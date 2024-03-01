import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PixelService } from '@notify/nfc-app-services';
import { CursorComponent, LoadingComponent } from '@notify/ngx-components';
import { Subject, combineLatest, tap } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { FeaturesComponent } from '../features/features.component';
import { InstructionsComponent } from '../instructions/instructions.component';
import { PartnersComponent } from '../partners/partners.component';
import { QuestionsComponent } from '../questions/questions.component';
import { SplashComponent } from '../splash/splash.component';
import { SustainabilityComponent } from '../sustainability/sustainability.component';

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
    SustainabilityComponent,
    QuestionsComponent,
    CursorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public splashSable$ = new Subject<void>();
  public instructionsStable$ = new Subject<void>();
  public sustainabilityStable$ = new Subject<void>();

  public pageStable$ = combineLatest([
    this.splashSable$,
    this.instructionsStable$,
    this.sustainabilityStable$,
  ]).pipe(tap(() => this.scrollToElement()));

  constructor(
    private _pixel: PixelService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._pixel.track('ViewContent');
  }

  public scrollToElement() {
    this._activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
