import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SSRBaseComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-activate-license',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate-license.component.html',
  styleUrl: './activate-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateLicenseComponent extends SSRBaseComponent {}
