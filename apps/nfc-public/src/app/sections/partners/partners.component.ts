import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'notify-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css',
})
export class PartnersComponent implements AfterViewInit {
  private _platformId = inject(PLATFORM_ID);

  @ViewChild('MarqueeContent') marqueeContent!: ElementRef<HTMLUListElement>;

  public partners = [
    {
      title: 'Pegaso Florence',
      profile: '65b4123355f91802d0f2585e',
      class: 'opacity-50',
      image: '/assets/partners/pegaso.webp',
    },
    {
      title: 'Legione Etruria',
      profile: '65c2b3edec503b4a3bf7bbda',
      class: 'opacity-50',
      image: '/assets/partners/legione-etruria.svg',
    },
    {
      title: 'Rima Ispezioni',
      profile: '66687001e8fbfbfbc98b30a8',
      class: 'p-2 opacity-50',
      image: '/assets/partners/rima.webp',
    },
    {
      title: 'Outfitter Wardrobe',
      profile: '65bab4c0f33197577d4693a0',
      class: 'opacity-50 p-6',
      image: '/assets/partners/outfitter.svg',
    },
    {
      title: 'Menumal',
      profile: '65b6a56b72720d2230ee042e',
      class: 'p-3  opacity-50',
      image: '/assets/partners/menumal.webp',
    },
    {
      title: 'Recivu',
      profile: '65b4100930cf4330211360fc',
      class: ' p-6 lg:p-4 opacity-50',
      image: '/assets/partners/recivu.svg',
    },
    {
      title: 'Green - Glam Restaurant',
      profile: 'green',
      class: 'p-2 opacity-50',
      image: '/assets/partners/green.webp',
    },

    {
      title: 'Vanitage',
      profile: '669aa76e53991796f66ec9cb',
      class: 'p-6 opacity-50',
      image: '/assets/partners/vanitage.webp',
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    const root = document.documentElement;
    const marqueeContent = this.marqueeContent.nativeElement;

    if (!marqueeContent?.children.length) return;

    root.style.setProperty(
      '--marquee-elements',
      marqueeContent.children.length as unknown as string
    );

    Array.from(marqueeContent.children).forEach((element) => {
      marqueeContent.appendChild(element.cloneNode(true));
    });
  }
}
