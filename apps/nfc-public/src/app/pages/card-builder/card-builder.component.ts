import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ContactUsComponent } from '../../sections/contact-us/contact-us.component';

@Component({
  standalone: true,
  imports: [CommonModule, TopNavComponent, ContactUsComponent],

  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss',
})
export class CardBuilderComponent {
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
}
