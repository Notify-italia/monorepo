import { CommonModule } from '@angular/common';
import { Component, afterNextRender, inject } from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import {
  LoadingComponent,
  PixelService,
  SplineViewerComponent,
} from '@notify/ngx-shared';
import { Observable, Subject, combineLatest } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { FeaturesComponent } from '../../sections/features/features.component';
import { InstructionsComponent } from '../../sections/instructions/instructions.component';
import { ProfileBuilderComponent } from '../../sections/profile-builder/profile-builder.component';
import { QuestionsComponent } from '../../sections/questions/questions.component';
import { ShopComponent } from '../../sections/shop/shop.component';
import { SplashComponent } from '../../sections/splash/splash.component';
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
    InstructionsComponent,
    QuestionsComponent,
    ProfileBuilderComponent,
    ShopComponent,
    TrustedByComponent,
    SplineViewerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _pixel = inject(PixelService);

  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownObject>();

  constructor() {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        this.instructionsStable$,
        this.featuresStable$,
      ]);
    });
  }
}
