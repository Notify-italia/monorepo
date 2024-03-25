import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileService } from '@notify/nfc-app-services';
import { ProfilePlayerFactory } from '@notify/ngx-shared';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'notify-partners',
  standalone: true,
  imports: [CommonModule],
  providers: [ProfilePlayerFactory, ProfileService],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent {
  public partners = [
    {
      title: 'Recivu',
      profile: '65b4100930cf4330211360fc',
      class: 'p-4 opacity-75',
      image: '/assets/partners/recivu.svg',
    },
    {
      title: 'Pegaso Florence',
      profile: '65b4123355f91802d0f2585e',
      class: 'opacity-75',
      image: '/assets/partners/pegaso.webp',
    },
    {
      title: 'Legione Etruria',
      profile: '65c2b3edec503b4a3bf7bbda',
      class: 'opacity-75',
      image: '/assets/partners/legione-etruria.svg',
    },
    {
      title: 'Outfitter Wardrobe',
      profile: '65bab4c0f33197577d4693a0',
      class: 'opacity-50 p-4',
      image: '/assets/partners/outfitter.svg',
    },
    {
      title: 'Menumal',
      profile: '65b6a56b72720d2230ee042e',
      class: 'p-3  opacity-75',
      image: '/assets/partners/menumal.webp',
    },
  ];

  constructor(
    private _profileService: ProfileService,
    private _profilePlayer: ProfilePlayerFactory
  ) {}

  public showProfile(id: string) {
    this._profileService
      .getProfile(id)
      .pipe(
        tap((v) =>
          this._profilePlayer.createPlayer({
            profile: v,
            baseUrl: environment.profilesUrl,
            hideShare: true,
          })
        )
      )
      .subscribe();
  }
}
