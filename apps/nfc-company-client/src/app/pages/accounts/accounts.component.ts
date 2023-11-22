import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnumNotifyUserType, INotifyAgent } from '@notify/interfaces';
import { PageHeaderComponent } from '@notify/ngx-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent {
  public placeholderAvatar =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
  public profiles$ = new BehaviorSubject<INotifyAgent[]>([
    {
      _id: '1',
      email: 'rossim@gmail.com',
      owner: '1',
      enabled: true,
      createdAt: new Date('2022-04-22T10:14:00'),
      updatedAt: new Date(),
      profile: {
        _id: '655805b7f5638dc5ef4b358c',
        name: 'Mario',
        surname: 'Rossi',
        email: 'notifyitalia@gmail.com',
        phoneNumber: '391 322 5127',
        bio: 'PORCO DIO',
        role: 'Head of Sales',
        avatar:
          'https://static01.nyt.com/images/2015/04/17/business/17scribd-web/17scribd-web-articleLarge-v2.jpg?quality=75&auto=webp&disable=upscale',

        config: {
          whatsappEnabled: true,
          phoneCallEnabled: true,
          emailEnabled: true,
        },
        type: EnumNotifyUserType.Agent,
        owner: '655805b7f5638dc5ef4b358b',
        customFields: [
          {
            iconName: 'ebay',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'linkedin',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'signal',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
        ],
        createdAt: new Date('2020-11-21T00:02:18.873Z'),
        updatedAt: new Date('2020-11-21T00:02:18.873Z'),
      },
    },
    {
      _id: '1',
      email: 'rossim@gmail.com',
      owner: '1',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        _id: '655805b7f5638dc5ef4b358c',
        name: null,
        surname: null,
        email: 'notifyitalia@gmail.com',
        phoneNumber: '391 322 5127',
        bio: 'PORCO DIO',
        role: 'Junior Salesman',
        avatar: null,
        config: {
          whatsappEnabled: true,
          phoneCallEnabled: true,
          emailEnabled: true,
        },
        type: EnumNotifyUserType.Agent,
        owner: '655805b7f5638dc5ef4b358b',
        customFields: [
          {
            iconName: 'ebay',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'linkedin',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'signal',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
        ],
        createdAt: new Date('2020-11-21T00:02:18.873Z'),
        updatedAt: new Date('2020-11-21T00:02:18.873Z'),
      },
    },
    {
      _id: '1',
      email: 'luigiv@gmail.com',
      owner: '1',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        _id: '655805b7f5638dc5ef4b358c',
        name: 'Luigi',
        surname: 'Verdi',
        email: 'notifyitalia@gmail.com',
        phoneNumber: '391 322 5127',
        bio: 'PORCO DIO',
        role: 'Senior Sales Manager',
        avatar: 'https://daisyui.com/tailwind-css-component-profile-2@56w.png',
        config: {
          whatsappEnabled: true,
          phoneCallEnabled: true,
          emailEnabled: true,
        },
        type: EnumNotifyUserType.Agent,
        owner: '655805b7f5638dc5ef4b358b',
        customFields: [
          {
            iconName: 'ebay',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'linkedin',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
          {
            iconName: 'signal',
            value:
              'https://profiles-player.vps.notifygroup.it/profile?p=65562ddec01fcc3812c28e11',
          },
        ],
        createdAt: new Date('2020-11-21T00:02:18.873Z'),
        updatedAt: new Date('2020-11-21T00:02:18.873Z'),
      },
    },
  ]);
}
