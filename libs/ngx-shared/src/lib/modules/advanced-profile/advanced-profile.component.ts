import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeftPanelComponent } from './parts/left-panel/left-panel.component';
import { RightPanelComponent } from './parts/right-panel/right-panel.component';

@Component({
  selector: 'notify-advanced-profile',
  standalone: true,
  imports: [CommonModule, LeftPanelComponent, RightPanelComponent],
  templateUrl: './advanced-profile.component.html',
  styleUrl: './advanced-profile.styles.scss',
})
export class AdvancedProfileComponent {}
