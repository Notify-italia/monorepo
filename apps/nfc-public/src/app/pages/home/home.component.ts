import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PixelService } from '@notify/nfc-app-services';
import { CursorComponent, LoadingComponent } from '@notify/ngx-components';
import { Subject, combineLatest, tap } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../../sections/contact-us/contact-us.component';
import { FeaturesComponent } from '../../sections/features/features.component';
import { InstructionsComponent } from '../../sections/instructions/instructions.component';
import { PartnersComponent } from '../../sections/partners/partners.component';
import { PersonalizationComponent } from '../../sections/personalization/personalization.component';
import { QuestionsComponent } from '../../sections/questions/questions.component';
import { SplashComponent } from '../../sections/splash/splash.component';
import { SustainabilityComponent } from '../../sections/sustainability/sustainability.component';

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
    PersonalizationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public instructionsStable$ = new Subject<void>();

  public stable = false;

  public pageStable$ = combineLatest([this.instructionsStable$])
    .pipe(
      tap(() => this.scrollToElement()),
      tap(() => (this.stable = true))
    )
    .subscribe();

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
