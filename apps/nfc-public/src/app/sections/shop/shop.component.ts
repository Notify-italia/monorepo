import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SSRBaseComponent } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'notify-shop',
  styleUrls: ['./shop.component.scss'],
  templateUrl: './shop.component.html',
})
export class ShopComponent extends SSRBaseComponent {}
