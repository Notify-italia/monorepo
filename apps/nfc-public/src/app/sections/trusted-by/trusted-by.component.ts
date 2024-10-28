import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SSRBaseComponent } from '@notify/ngx-shared';
import { PartnersComponent } from '../partners/partners.component';

@Component({
  selector: 'notify-trusted-by',
  standalone: true,
  imports: [CommonModule, PartnersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trusted-by.component.html',
  styleUrl: './trusted-by.component.scss',
})
export class TrustedByComponent extends SSRBaseComponent {}
