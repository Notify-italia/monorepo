import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  constructor(
    @Inject('suffix') private _suffix: string,
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  public init() {
    this._router.events.subscribe((data) => {
      if (!(data instanceof ActivationStart)) {
        return;
      }
      console.log('NavigationEnd', data.snapshot.data);
      this.setTitle(data.snapshot.data['pageTitle']);
    });
  }

  public setTitle(title: string) {
    if (!title) {
      this._titleService.setTitle(this._suffix);
      return;
    }

    this._titleService.setTitle(title + ' - ' + this._suffix);
  }
}

export const providePageTitleService = (suffix: string) => {
  return {
    provide: PageTitleService,
    deps: [Title, ActivatedRoute, Router],
    useFactory: (title: Title, ac: ActivatedRoute, router: Router) => {
      return new PageTitleService(suffix, title, ac, router);
    },
  };
};
