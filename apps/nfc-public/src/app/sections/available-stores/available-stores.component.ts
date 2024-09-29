import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SSRBaseComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-available-stores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-stores.component.html',
  styleUrl: './available-stores.component.scss',
})
export class AvailableStoresComponent extends SSRBaseComponent {}
