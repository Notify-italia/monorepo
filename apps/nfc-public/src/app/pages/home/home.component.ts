import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import {
  AnimationsService,
  EnumAnimationsDrivers,
  LoadingComponent,
  PixelService,
  UtilsService,
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
  ],
  providers: [AnimationsService, UtilsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private _platformId = inject(PLATFORM_ID);

  private _pixel = inject(PixelService);
  private _animationsService = inject(AnimationsService);
  private _utilsService = inject(UtilsService);

  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownObject>();

  constructor() {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        this.featuresStable$,
      ]);
    });
  }

  public ngAfterViewInit() {
    if (
      !isPlatformBrowser(this._platformId) ||
      this._utilsService.currentTailwindMediaQuery() === 'none'
    ) {
      return;
    }

    this._animationsService.declareAnimation(
      document.querySelector('#instructions'),
      {
        scrollY: this._animationsService.presets.blurInOut(),
      }
    );

    this._animationsService.declareAnimation(
      document.querySelector('#features'),
      {
        scrollY: this._animationsService.presets.blurInOut(),
      }
    );

    this._animationsService.declareAnimation(
      document.querySelector('#splash'),
      {
        scrollY: this._animationsService.presets.blurInOut(),
      }
    );
    this._animationsService.declareAnimation(
      document.querySelector('#trustedby'),
      {
        scrollY: this._animationsService.presets.blurInOut({
          ignoreScaling: true,
        }),
      }
    );

    this._animationsService.updateDrivers([
      {
        driver: EnumAnimationsDrivers.ScrollY,
        currentValue: window.scrollY,
      },
    ]);
  }

  @HostListener('window:scroll')
  public onScroll() {
    this._animationsService.updateDriver(
      EnumAnimationsDrivers.ScrollY,
      window.scrollY
    );
    // this._animationsService.updateDriver(
    //   EnumAnimationsDrivers.ScrollX,
    //   window.scrollY
    // );
  }

  // @HostListener('window:resize', ['$event'])
  // public onResize() {
  //   if (!isPlatformBrowser(this._platformId)) {
  //     return;
  //   }
  //   this._animationsService.updateDriver(
  //     EnumAnimationsDrivers.PageWidth,
  //     window.innerWidth
  //   );
  //   this._animationsService.updateDriver(
  //     EnumAnimationsDrivers.PageHeight,
  //     window.innerHeight
  //   );
  // }
}
