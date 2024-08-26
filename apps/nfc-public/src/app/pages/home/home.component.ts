import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  afterNextRender,
  inject,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { INotifyEcommerceProduct, UnknownType } from '@notify/interfaces';
import {
  AnimationsService,
  EcommerceService,
  EnumAnimationsDrivers,
  LoadingComponent,
  PixelService,
  SplineViewerComponent,
  UtilsService,
} from '@notify/ngx-shared';
import _ from 'lodash';
import { Observable, Subject, combineLatest } from 'rxjs';
import { EcommerceCartFactory } from '../../components/ecommerce-cart/ecommerce-cart.factory';
import { EcommerceItemDetailFactory } from '../../components/ecommerce-item-detail/ecommerce-item-detail.factory';
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
  providers: [
    AnimationsService,
    UtilsService,
    EcommerceItemDetailFactory,
    EcommerceCartFactory,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  // @ViewChild('CircleContainer')
  // private _circleContainer!: ElementRef<HTMLDivElement>;
  private _pixel = inject(PixelService);
  private _animationsService = inject(AnimationsService);
  private _utilsSerivce = inject(UtilsService);
  private _ecommService = inject(EcommerceService);
  private _meta = inject(Meta);
  private _itemDetail = inject(EcommerceItemDetailFactory);
  private _cart = inject(EcommerceCartFactory);

  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();
  public splineReady$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownType>();

  public anchors: { fragment: string; options?: IAnchorOptions }[] = [];
  private _currentAnchor = 0;

  constructor() {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        // this.instructionsStable$,
        this.splineReady$,
        this.featuresStable$,
      ]);
    });

    this._scrollAnchors = _.debounce(this._scrollAnchors, 250);
    this.showItemDetail = _.debounce(this.showItemDetail.bind(this), 500);
  }

  public ngAfterViewInit(): void {
    if (!this._animationsService.isCapable) {
      return;
    }

    const transitionThreshold = 100;

    this._animationsService.declareAnimation('#bubble', {
      scrollY: (value: number) => {
        const aboveThreshold = this._utilsSerivce.isMobile
          ? true
          : value > transitionThreshold;
        this._meta.updateTag({
          name: 'theme-color',
          content: aboveThreshold ? '#99D2D9' : '#8CC5CD',
        });
        return {
          transform: `scaleX(${aboveThreshold ? 2 : 1}) scaleY(${
            aboveThreshold ? 2 : 1
          })`,
        };
      },
    });

    // this._animationsService.declareAnimation('#mouseGlpyh', {
    //   scrollY: (value: number) => ({
    //     opacity: value > transitionThreshold ? 0 : 1,
    //   }),
    // });

    this._animationsService.declareAnimation('#bubbleOutline', {
      scrollY: (value: number) => ({
        opacity:
          value > transitionThreshold || this._utilsSerivce.isMobile ? 0 : 1,
      }),
    });

    // if (!this._utilsSerivce.isMobile) {
    //   this.anchors
    //     .filter((v) => !v.options?.ignoreBlur)
    //     .forEach((anchor) => {
    //       this._animationsService.declareAnimation(`#${anchor.fragment}`, {
    //         scrollY: this._animationsService.presets.blurInOut(),
    //       });
    //     });
    // }

    this._animationsService.initDriver(
      EnumAnimationsDrivers.ScrollY,
      window.scrollY
    );
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll() {
    // event.preventDefault();
    // this._scrollAnchors(event.deltaY > 0 ? 'down' : 'up');
    this._animationsService.updateDriver(
      EnumAnimationsDrivers.ScrollY,
      window.scrollY
    );
  }

  public publishAnchor(fragment: string, options?: IAnchorOptions): void {
    this.anchors.push({ fragment, options });
  }

  public showItemDetail(item: INotifyEcommerceProduct) {
    const ref = this._itemDetail.create({ item });

    ref.instance.submitted.subscribe((v) => {
      if (!v) {
        return;
      }

      this._ecommService.addToCart(item, v.quantity, v.parsedOptions);
    });
  }

  public showCart() {
    this._cart.create();
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
    document.getElementById(fragment)?.scrollIntoView({
      block: 'center',
    });
  }
}
