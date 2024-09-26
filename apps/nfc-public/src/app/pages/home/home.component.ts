import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  afterNextRender,
  inject,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { INotifyEcommerceProduct, UnknownType } from '@notify/interfaces';
import {
  AnimationsService,
  EcommerceService,
  EnumAnimationsDrivers,
  IAnimationCSSStyle,
  LoadingComponent,
  PixelService,
  SplineViewerComponent,
  UtilsService,
} from '@notify/ngx-shared';
import _ from 'lodash';
import { Observable, Subject, combineLatest, tap } from 'rxjs';
import { EcommerceCartFactory } from '../../components/ecommerce-cart/ecommerce-cart.factory';
import { EcommerceItemDetailFactory } from '../../components/ecommerce-item-detail/ecommerce-item-detail.factory';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ActivateLicenseComponent } from '../../sections/activate-license/activate-license.component';
import { EditorFeaturesComponent } from '../../sections/editor-features/editor-features.component';
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
    RouterModule,
    EditorFeaturesComponent,
    ActivateLicenseComponent,
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
  private _activatedRoute = inject(ActivatedRoute);
  private _location = inject(Location);

  public instructionsStable$ = new Subject<void>();
  public splashStable$ = new Subject<void>();
  public featuresStable$ = new Subject<void>();
  public splineReady$ = new Subject<void>();

  public pageStable$ = new Observable<UnknownType>();

  public anchors: { fragment: string; options?: IAnchorOptions }[] = [];

  constructor() {
    afterNextRender(() => {
      this.pageStable$ = combineLatest([
        // this.splashStable$,
        // this.instructionsStable$,
        // this.splineReady$,
        this.featuresStable$,
      ]).pipe(
        tap(() => {
          // this._pixel.track('PageView');
        })
      );
    });

    this.showItemDetail = _.debounce(this.showItemDetail.bind(this), 500);
  }

  public ngAfterViewInit(): void {
    if (!this._animationsService.isCapable) {
      return;
    }

    this._activatedRoute.fragment.subscribe((fragment) => {
      if (!fragment) {
        return;
      }

      if (fragment === 'cart') {
        this.showCart();
      }

      if (fragment.startsWith('shop')) {
        this._fetchItem(fragment.replace('shop/', ''));
      }
    });

    const transitionThreshold = 100;

    this._animationsService.declareAnimation('#bubble', {
      scrollY: (value: number) => {
        const aboveThreshold = this._utilsSerivce.isMobile
          ? true
          : value > transitionThreshold;
        this._meta.updateTag({
          name: 'theme-color',
          content: '#ffffff',
        });
        return {
          transform: `scaleX(${aboveThreshold ? 2 : 1}) scaleY(${
            aboveThreshold ? 2 : 1
          })`,
        };
      },
    });
    this._animationsService.declareAnimation('#topnav', {
      scrollY: (value: number) => {
        const aboveThreshold = value > transitionThreshold;

        if (!aboveThreshold) {
          return {
            ['backdrop-filter']: `blur(30px) !important`,
            ['-webkit-backdrop-filter']: `blur(30px) !important`,

            ['background']: `rgba(225, 225, 225, 0.05) !important`,

            ['mask-image']: `linear-gradient(
    rgb(0, 0, 0) 50%,
    rgba(0, 0, 0, 0.8) 70%,
    rgba(0, 0, 0, 0) 100%
  ) !important`,

            [`-webkit-mask-image`]: `linear-gradient(
    rgb(0, 0, 0) 50%,
    rgba(0, 0, 0, 0.8) 70%,
    rgba(0, 0, 0, 0) 100%
  ) !important`,
          } as IAnimationCSSStyle;
        }

        return {
          ['background-color']: `rgba(255, 255, 255)`,
          ['--tw-shadow']: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
          ['--tw-shadow-colored']: `0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)`,
          ['box-shadow']: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)`,
        };
      },
    });

    this._animationsService.declareAnimation('#bubbleOutline', {
      scrollY: (value: number) => ({
        opacity:
          value > transitionThreshold || this._utilsSerivce.isMobile ? 0 : 1,
      }),
    });

    this._animationsService.initDriver(
      EnumAnimationsDrivers.ScrollY,
      window.scrollY
    );
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll() {
    this._animationsService.updateDriver(
      EnumAnimationsDrivers.ScrollY,
      window.scrollY
    );
  }

  public publishAnchor(fragment: string, options?: IAnchorOptions): void {
    this.anchors.push({ fragment, options });
  }

  public showItemDetail(item: INotifyEcommerceProduct) {
    this._location.replaceState('/#shop/' + item.id);
    this._pixel.track('ViewContent', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'EUR',
    });
    const ref = this._itemDetail.create({ item });

    ref.instance.submitted.subscribe((v) => {
      if (!v) {
        return;
      }

      this._pixel.track('AddToCart', {
        content_ids: [item.id],
        contents: [
          {
            id: item.id,
            quantity: v.quantity,
          },
        ],
        value: item.price,
        currency: 'EUR',
      });
      this._ecommService.addToCart(item, v.quantity, v.parsedOptions);
    });

    ref.instance.destroyed$.subscribe(() => {
      const pathWithoutHash = this._location.path(false);

      this._location.replaceState(pathWithoutHash);
    });
  }

  public showCart() {
    this._location.replaceState('/#cart');

    const ref = this._cart.create();
    ref.instance.destroyed$.subscribe(() => {
      const pathWithoutHash = this._location.path(false);

      this._location.replaceState(pathWithoutHash);
    });
  }

  private _fetchItem(item: INotifyEcommerceProduct['id']) {
    const product = this._ecommService.products.find(
      (product) => product.id === item
    );

    if (!product) {
      return;
    }

    this.showItemDetail(product);
  }

  public scrollTo(fragment: string) {
    const anchor = this.anchors.find((a) => a.fragment === fragment);

    if (!anchor) {
      return;
    }

    const el = document.getElementById(fragment);

    if (!el) {
      return;
    }

    const yOffset = -80;

    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
