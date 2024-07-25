import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnknownObject } from '@notify/interfaces';
import {
  CursorComponent,
  LoadingComponent,
  PixelService,
} from '@notify/ngx-shared';
import { Observable, Subject, combineLatest, tap } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { CardBuilderComponent } from '../../sections/card-builder/card-builder.component';
import { ContactUsComponent } from '../../sections/contact-us/contact-us.component';
import { FeaturesComponent } from '../../sections/features/features.component';
import { InstructionsComponent } from '../../sections/instructions/instructions.component';
import { PartnersComponent } from '../../sections/partners/partners.component';
import { PersonalizationComponent } from '../../sections/personalization/personalization.component';
import { ProfileBuilderComponent } from '../../sections/profile-builder/profile-builder.component';
import { QuestionsComponent } from '../../sections/questions/questions.component';
import { ShopComponent } from '../../sections/shop/shop.component';
import { SoftwareOnlyComponent } from '../../sections/software-only/software-only.component';
import { SplashComponent } from '../../sections/splash/splash.component';
import { SustainabilityComponent } from '../../sections/sustainability/sustainability.component';
import { TrustedByComponent } from '../../sections/trusted-by/trusted-by.component';

@Component({
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
    CardBuilderComponent,
    SoftwareOnlyComponent,
    ProfileBuilderComponent,
    ShopComponent,
    TrustedByComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownObject>();

  constructor(
    private _pixel: PixelService,
    private _activatedRoute: ActivatedRoute
  ) {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        this.featuresStable$,
      ]).pipe(tap(() => this.scrollToElement()));
    });
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
