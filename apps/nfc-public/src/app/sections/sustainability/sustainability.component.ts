import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplineViewerComponent } from '@notify/ngx-shared';
import { BasePageComponent } from '../../components/base-page/base-page.component';

@Component({
  selector: 'notify-sustainability',
  standalone: true,
  imports: [CommonModule, SplineViewerComponent],
  templateUrl: './sustainability.component.html',
  styleUrl: './sustainability.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SustainabilityComponent extends BasePageComponent {}
