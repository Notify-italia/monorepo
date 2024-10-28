import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SSRBaseComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-editor-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-features.component.html',
  styleUrl: './editor-features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorFeaturesComponent extends SSRBaseComponent {
  public nowLiveLabel = 'disponibile';
  public comingSoonLabel = 'in arrivo';
}
