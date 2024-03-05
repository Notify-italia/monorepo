import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'notify-personalization',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss',
})
export class PersonalizationComponent {}
