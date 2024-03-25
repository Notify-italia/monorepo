import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayoutBaseComponent } from '../../constructors/layout.base.component';

@Component({
  selector: 'notify-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent extends PageLayoutBaseComponent {}
