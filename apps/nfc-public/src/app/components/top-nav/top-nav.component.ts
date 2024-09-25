import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTitleComponent, EcommerceService } from '@notify/ngx-shared';

@Component({
  selector: 'notify-top-nav',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  public ecommerce = inject(EcommerceService);

  @Output() CartClicked = new EventEmitter<void>();
  @Output() startFreeClicked = new EventEmitter<void>();
}
