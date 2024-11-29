import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '@notify/ngx-shared';

@Component({
  selector: 'notify-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  public ecommerce = inject(EcommerceService);

  @Output() CartClicked = new EventEmitter<void>();

  public menuItems = [
    {
      label: 'Crea un account',
      href: 'https://aziende.notifyapp.it/signup',
    },
    {
      label: "Scarica l'app",
      href: '#stores',
    },
    {
      label: 'Acquista',
      href: '#shop',
    },
    {
      label: 'Q&A',
      href: '#faq',
    },
  ];
}
