import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'notify-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent implements OnInit {
  public partners = [
    {
      title: 'Recivu',
      profile: '65b4100930cf4330211360fc',
      class: 'p-4 opacity-75',
      image: '/assets/partners/recivu.svg',
    },
    // {
    //   title: 'Pegaso Florence',
    //   profile: '65b4123355f91802d0f2585e',
    //   class: 'opacity-75',
    //   image: '/assets/partners/pegaso.webp',
    // },
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
    {
      title: 'Green - Glam Restaurant',
      profile: 'green',
      class: 'p-2',
      image: '/assets/partners/green.webp',
    },
  ];

  ngOnInit() {
    const root = document.documentElement;
    const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue(
      '--marquee-elements-displayed'
    );
    const marqueeContent = document.querySelector('ul.marquee-content');

    console.log(`childrne`, marqueeContent?.children);

    if (!marqueeContent?.children.length) return;

    root.style.setProperty(
      '--marquee-elements',
      marqueeContent.children.length as unknown as string
    );

    for (let i = 0; i < Number(marqueeElementsDisplayed); i++) {
      marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
    }
  }
}
