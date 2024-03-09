import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, afterNextRender } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PixelService } from '@notify/nfc-app-services';
import { CursorComponent, LoadingComponent } from '@notify/ngx-components';
import { Subject, combineLatest, tap } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { CardBuilderComponent } from '../../sections/card-builder/card-builder.component';
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
    CardBuilderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterContentInit {
  public instructionsStable$ = new Subject<void>();

  public stable = false;

  public pageStable$ = combineLatest([this.instructionsStable$]).pipe(
    tap(() => window.scrollTo(0, 0)),
    tap(() => this.scrollToElement()),
    tap(() => (this.stable = true))
  );

  constructor(
    private _pixel: PixelService,
    private _activatedRoute: ActivatedRoute
  ) {
    afterNextRender(() => {
      this._pixel.track('ViewContent');
      // _initTileDesk();
    });
  }

  public ngAfterContentInit() {
    this.pageStable$.subscribe();
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

// const _initTileDesk = () => {
//   window.tiledeskSettings = {
//     projectid: '65ec3f0992ab270015f8fa58',
//   };
//   (function (d, s, id) {
//     var w = window;
//     var d = document;
//     var i = function () {
//       i.c(arguments);
//     };
//     i.q = [];
//     i.c = function (args) {
//       i.q.push(args);
//     };
//     w.Tiledesk = i;
//     var js,
//       fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s);
//     js.id = id;
//     js.async = true;

//     js.src = 'https://widget.tiledesk.com/v6/launch.js';
//     fjs.parentNode.insertBefore(js, fjs);
//   })(document, 'script', 'tiledesk-jssdk');
// };
