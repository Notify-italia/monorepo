import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeftMenuComponent } from './parts/left-menu.component';

@Component({
  selector: 'notify-advanced-profile',
  standalone: true,
  imports: [CommonModule, LeftMenuComponent],
  templateUrl: './advanced-profile.component.html',
  styleUrl: './advanced-profile.styles.scss',
})
export class AdvancedProfileComponent {}
