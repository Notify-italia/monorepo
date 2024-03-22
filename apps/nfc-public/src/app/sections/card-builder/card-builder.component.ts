import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { UploadComponent } from '@notify/ngx-components';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';

@Component({
  standalone: true,
  imports: [CommonModule, TopNavComponent, ContactUsComponent, UploadComponent],
  selector: 'notify-card-builder',
  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss',
})
export class CardBuilderComponent {
  public isDropzoneOpen = false;

  public cards = [
    {
      theme: 'vermicelli',
      thumb: '/assets/cards/vermicelli/thumb.webp',
      items: [
        {
          title: 'river.svg',
          path: '/assets/cards/vermicelli/river.svg',
          thumb: '/assets/cards/vermicelli/river_thumb.webp',
        },
        {
          title: 'banana.svg',
          path: '/assets/cards/vermicelli/banana.svg',
          thumb: '/assets/cards/vermicelli/banana_thumb.webp',
        },
        {
          title: 'neon.svg',
          path: '/assets/cards/vermicelli/neon.svg',
          thumb: '/assets/cards/vermicelli/neon_thumb.webp',
        },
      ],
    },
    {
      theme: 'esagoni',
      thumb: '/assets/cards/esagoni/thumb.webp',
      items: [
        {
          title: 'river.svg',
          path: '/assets/cards/esagoni/river.svg',
          thumb: '/assets/cards/esagoni/river_thumb.webp',
        },
        {
          title: 'banana.svg',
          path: '/assets/cards/esagoni/banana.svg',
          thumb: '/assets/cards/esagoni/banana_thumb.webp',
        },
        {
          title: 'neon.svg',
          path: '/assets/cards/esagoni/neon.svg',
          thumb: '/assets/cards/esagoni/neon_thumb.webp',
        },
      ],
    },
    {
      theme: 'cubi',
      thumb: '/assets/cards/cubi/thumb.webp',
      items: [
        {
          title: 'river.svg',
          path: '/assets/cards/cubi/river.svg',
          thumb: '/assets/cards/cubi/river_thumb.webp',
        },
        {
          title: 'banana.svg',
          path: '/assets/cards/cubi/banana.svg',
          thumb: '/assets/cards/cubi/banana_thumb.webp',
        },
        {
          title: 'neon.svg',
          path: '/assets/cards/cubi/neon.svg',
          thumb: '/assets/cards/cubi/neon_thumb.webp',
        },
      ],
    },
    {
      theme: 'pastello',
      thumb: '/assets/cards/pastello/thumb.webp',
      items: [
        {
          title: 'black.svg',
          path: '/assets/cards/pastello/black.svg',
          thumb: '/assets/cards/pastello/black_thumb.webp',
        },
        {
          title: 'blue.svg',
          path: '/assets/cards/pastello/blue.svg',
          thumb: '/assets/cards/pastello/blue_thumb.webp',
        },
        {
          title: 'grass.svg',
          path: '/assets/cards/pastello/grass.svg',
          thumb: '/assets/cards/pastello/grass_thumb.webp',
        },
        {
          title: 'lemon.svg',
          path: '/assets/cards/pastello/lemon.svg',
          thumb: '/assets/cards/pastello/lemon_thumb.webp',
        },
        {
          title: 'purple.svg',
          path: '/assets/cards/pastello/purple.svg',
          thumb: '/assets/cards/pastello/purple_thumb.webp',
        },
        {
          title: 'pink.svg',
          path: '/assets/cards/pastello/pink.svg',
          thumb: '/assets/cards/pastello/pink_thumb.webp',
        },
        {
          title: 'red.svg',
          path: '/assets/cards/pastello/red.svg',
          thumb: '/assets/cards/pastello/red_thumb.webp',
        },
      ],
    },
  ];

  public selectedCard: {
    title: string;
    path: string;
    thumb: string;
    data?: Buffer | null;
  } = {
    title: 'river.svg',
    path: '/assets/cards/vermicelli/river.svg',
    thumb: '/assets/cards/vermicelli/river_thumb.webp',
  };

  constructor() {
    afterNextRender(() => {
      this.updateCard(this.cards[0].items[0]);
    });
  }

  rotateItem(event: MouseEvent, coeff = 50, elem?: HTMLElement) {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      return;
    }

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

  public async updateCard(card: typeof this.selectedCard) {
    card.data = (await (
      await this._getCurrentCardBlob(card)
    )?.arrayBuffer()) as Buffer;
    this.selectedCard = card;
  }

  private _getCurrentCardBlob(card: {
    title: string;
    path: string;
    thumb: string;
  }) {
    // if (this.selectedCard.title === 'Custom') {
    //   return this.selectedCard.path;
    // }

    return fetch(card.path)
      .then((res) => res.blob())
      .then((blob) => {
        return blob;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}
