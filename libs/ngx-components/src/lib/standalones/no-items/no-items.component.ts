import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayoutBaseComponent } from '../layout.base.component';

@Component({
  selector: 'notify-no-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-items.component.html',
  styleUrl: './no-items.component.scss',
})
export class NoItemsComponent extends PageLayoutBaseComponent {}
