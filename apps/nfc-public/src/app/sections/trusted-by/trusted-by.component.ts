import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PartnersComponent } from '../partners/partners.component';

@Component({
  selector: 'notify-trusted-by',
  standalone: true,
  imports: [CommonModule, PartnersComponent],
  templateUrl: './trusted-by.component.html',
  styleUrl: './trusted-by.component.scss',
})
export class TrustedByComponent {}
