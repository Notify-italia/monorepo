import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CapacitorService,
  ChangelogFactory,
  NavComponent,
  NavItem,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule],
  providers: [CapacitorService, ChangelogFactory],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public nav: NavItem[] = [
    {
      label: 'Dashboard',
      icon: [],
      path: '/pages/dashboard',
    },
    {
      label: 'Aziende',
      icon: [],
      path: '/pages/customers',
    },
    {
      label: 'Licenze',
      icon: [],
      path: '/pages/licenses',
    },
    // {
    //   label: 'Risorse',
    //   icon: [],
    //   path: '/resoruces',
    // },
  ];

  public bottomNav: NavItem[] = [
    {
      label: 'Esci',
      icon: [],
      disabled: true,
      path: '/',
    },
  ];
}
