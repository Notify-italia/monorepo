import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'notify-personalization',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalizationComponent {}
