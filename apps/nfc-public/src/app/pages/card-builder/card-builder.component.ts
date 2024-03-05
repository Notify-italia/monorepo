import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UploadComponent } from '@notify/ngx-components';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../../sections/contact-us/contact-us.component';

@Component({
  standalone: true,
  imports: [CommonModule, TopNavComponent, ContactUsComponent, UploadComponent],

  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss',
})
export class CardBuilderComponent {
  public isDropzoneOpen = false;

  public cards = [
    {
      theme: 'vermicelli',
      thumb: '/assets/cards/vermicelli/thumb.png',
      items: [
        {
          title: 'river',
          path: '/assets/cards/vermicelli/river.svg',
          thumb: '/assets/cards/vermicelli/river_thumb.png',
        },
        {
          title: 'banana',
          path: '/assets/cards/vermicelli/banana.svg',
          thumb: '/assets/cards/vermicelli/banana_thumb.png',
        },
        {
          title: 'neon',
          path: '/assets/cards/vermicelli/neon.svg',
          thumb: '/assets/cards/vermicelli/neon_thumb.png',
        },
      ],
    },
    {
      theme: 'esagoni',
      thumb: '/assets/cards/esagoni/thumb.png',
      items: [
        {
          title: 'river',
          path: '/assets/cards/esagoni/river.svg',
          thumb: '/assets/cards/esagoni/river_thumb.png',
        },
        {
          title: 'banana',
          path: '/assets/cards/esagoni/banana.svg',
          thumb: '/assets/cards/esagoni/banana_thumb.png',
        },
        {
          title: 'neon',
          path: '/assets/cards/esagoni/neon.svg',
          thumb: '/assets/cards/esagoni/neon_thumb.png',
        },
      ],
    },
    {
      theme: 'cubi',
      thumb: '/assets/cards/cubi/thumb.png',
      items: [
        {
          title: 'river',
          path: '/assets/cards/cubi/river.svg',
          thumb: '/assets/cards/cubi/river_thumb.png',
        },
        {
          title: 'banana',
          path: '/assets/cards/cubi/banana.svg',
          thumb: '/assets/cards/cubi/banana_thumb.png',
        },
        {
          title: 'neon',
          path: '/assets/cards/cubi/neon.svg',
          thumb: '/assets/cards/cubi/neon_thumb.png',
        },
      ],
    },
    {
      theme: 'pastello',
      thumb: '/assets/cards/pastello/thumb.png',
      items: [
        {
          title: 'black',
          path: '/assets/cards/pastello/black.svg',
          thumb: '/assets/cards/pastello/black_thumb.png',
        },
        {
          title: 'blue',
          path: '/assets/cards/pastello/blue.svg',
          thumb: '/assets/cards/pastello/blue_thumb.png',
        },
        {
          title: 'grass',
          path: '/assets/cards/pastello/grass.svg',
          thumb: '/assets/cards/pastello/grass_thumb.png',
        },
        {
          title: 'lemon',
          path: '/assets/cards/pastello/lemon.svg',
          thumb: '/assets/cards/pastello/lemon_thumb.png',
        },
        {
          title: 'purple',
          path: '/assets/cards/pastello/purple.svg',
          thumb: '/assets/cards/pastello/purple_thumb.png',
        },
        {
          title: 'pink',
          path: '/assets/cards/pastello/pink.svg',
          thumb: '/assets/cards/pastello/pink_thumb.png',
        },
        {
          title: 'red',
          path: '/assets/cards/pastello/red.svg',
          thumb: '/assets/cards/pastello/red_thumb.png',
        },
      ],
    },
  ];

  public selectedCard = this.cards[0].items[0];

  rotateItem(event: MouseEvent, coeff = 50, elem?: HTMLElement) {
    const card = elem || (event.currentTarget as HTMLElement);

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;

    const rotateX = (centerY - y) / coeff;
    const rotateY = (x - centerX) / coeff;
    const translateZ = Math.abs((centerY - y) / 10);

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
  }

  resetItem(event: MouseEvent, elem?: HTMLElement) {
    const card = elem || (event.currentTarget as HTMLElement);
    card.style.transform = '';
  }

  public closeDropzone() {
    this.isDropzoneOpen = false;
  }
}
