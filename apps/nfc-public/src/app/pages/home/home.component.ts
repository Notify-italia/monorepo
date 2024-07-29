import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import {
  AnimationsService,
  EnumAnimationsDrivers,
  LoadingComponent,
  PixelService,
  SplineViewerComponent,
} from '@notify/ngx-shared';
import _ from 'lodash';
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

interface IAnchorOptions {
  ignoreBlur?: boolean;
}
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
  providers: [AnimationsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('CircleContainer')
  private _circleContainer!: ElementRef<HTMLDivElement>;
  private _pixel = inject(PixelService);
  private _animationsService = inject(AnimationsService);

  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownObject>();

  public anchors: { fragment: string; options?: IAnchorOptions }[] = [];
  private _currentAnchor = 0;

  constructor() {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        // this.instructionsStable$,
        this.featuresStable$,
      ]);
    });

    this._scrollAnchors = _.debounce(this._scrollAnchors, 250);
  }

  public ngAfterViewInit(): void {
    if (!this._animationsService.isCapable) {
      return;
    }

    const transitionThreshold = 50;

    this._animationsService.declareAnimation('#bubble', {
      scrollY: (value: number) => {
        const aboveThreshold = value > transitionThreshold;
        return {
          height: aboveThreshold ? `100lvh` : '',
          width: aboveThreshold ? `100lvw` : '',
          ['border-radius']: aboveThreshold ? '0%' : '100%',
          top: aboveThreshold ? '0' : '',
          ['box-shadow']: aboveThreshold ? '0 0 0 0 rgba(0, 0, 0, 0)' : '',
        };
      },
    });

    this._animationsService.declareAnimation('#mouseGlpyh', {
      scrollY: (value: number) => ({
        opacity: value > transitionThreshold ? 0 : 1,
      }),
    });

    this._animationsService.declareAnimation('#bubbleOutline', {
      scrollY: (value: number) => ({
        opacity: value > transitionThreshold ? 0 : 1,
      }),
    });

    // this.anchors
    //   .filter((v) => !v.options?.ignoreBlur)
    //   .forEach((anchor) => {
    //     this._animationsService.declareAnimation(`#${anchor.fragment}`, {
    //       scrollY: this._animationsService.presets.blurInOut(),
    //     });
    //   });

    this._animationsService.initDriver(EnumAnimationsDrivers.ScrollY, 0);

    this._circleContainer.nativeElement.addEventListener('scroll', () => {
      this._animationsService.updateDriver(
        EnumAnimationsDrivers.ScrollY,
        this._circleContainer.nativeElement.scrollTop
      );
    });
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    // event.preventDefault();
    // this._scrollAnchors(event.deltaY > 0 ? 'down' : 'up');
  }

  public publishAnchor(fragment: string, options?: IAnchorOptions): void {
    this.anchors.push({ fragment, options });
  }

  private _scrollAnchors(direction: 'up' | 'down'): void {
    this._currentAnchor = this._currentAnchor + (direction === 'down' ? 1 : -1);

    if (this._currentAnchor >= this.anchors.length) {
      this._currentAnchor = this.anchors.length - 1;
      return;
    }

    if (this._currentAnchor < 0) {
      this._currentAnchor = 0;
    }

    this._goToAnchror(
      this.anchors[this._currentAnchor].fragment,
      this.anchors[this._currentAnchor].options
    );
  }

  private _goToAnchror(fragment: string, options: IAnchorOptions = {}): void {
    console.log('go to anchor', fragment, options);
    document.getElementById(fragment)?.scrollIntoView({
      block: 'center',
    });
  }
}
