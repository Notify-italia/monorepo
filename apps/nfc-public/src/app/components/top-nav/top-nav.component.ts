import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTitleComponent } from '@notify/ngx-components';

@Component({
  selector: 'notify-top-nav',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  public options: {
    label: string;
    path: string;
  }[] = [
    {
      label: 'Crea la tua tessera',
      path: '/personalize',
    },
  ];
}
