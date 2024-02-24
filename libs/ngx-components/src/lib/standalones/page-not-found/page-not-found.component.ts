import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WallpaperComponent } from '../animated-bg/wallpaper.component';
import { AppTitleComponent } from '../app-title/app-title.component';

@Component({
  selector: 'notify-page-not-found',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, WallpaperComponent, RouterModule],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  public noHomeRedirect =
    this._activatedRoute.snapshot.data?.['noHomeRedirect'] ?? false;

  constructor(private _activatedRoute: ActivatedRoute) {}
}
