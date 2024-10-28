import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppTitleComponent, SvgBoxIconComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-footer',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, SvgBoxIconComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
