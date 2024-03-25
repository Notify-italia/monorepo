import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { GestureController } from '@ionic/angular';
import { CapacitorService } from '@notify/ngx-shared';
import { VersionLabelComponent } from '../../modules/version-manager';
import { AppTitleComponent } from '../app-title/app-title.component';

export interface NavItem {
  label: string;
  path: string;
  style?: string;
  icon: string[];
  disabled?: boolean;
  hidden?: boolean;
}

@Component({
  selector: 'notify-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppTitleComponent,
    VersionLabelComponent,
  ],
  providers: [CapacitorService],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @ViewChild('DrawerController')
  drawerController!: ElementRef<HTMLInputElement>;
  @Input({ required: true }) subtitle = '';
  @Input() bottomItems: NavItem[] = [
    {
      label: 'Log out',
      path: '/pages/signout',
      style: 'text-red-500 font-bold',
      icon: [
        'M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z',
      ],
    },
  ];
  @Input({ required: true }) topItems: NavItem[] = [];
  @Input() disableScrollOn?: HTMLElement;
  @Input() versionInfo!: {
    currentVersion: string;
    currentVersionDate: string | Date;
  };

  @Output() versionClick = new EventEmitter<void>();

  public get availableItems() {
    return {
      top: this.topItems.filter((item) => !item.hidden),
      bottom: this.bottomItems.filter((item) => !item.hidden),
    };
  }

  private get _isUserWriting(): boolean {
    return (
      ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '') &&
      document.activeElement?.getAttribute('type') !== 'checkbox'
    );
  }

  constructor(
    public capacitor: CapacitorService,
    private _gestureCtrl: GestureController
  ) {
    this._gestureCtrl
      .create(
        {
          el: document.body,
          threshold: 15,
          gestureName: 'openDrawer',
          onMove: (ev) => {
            if (this._isUserWriting) {
              return;
            }

            if (ev.deltaX > 75) {
              this.drawerController.nativeElement.checked = true;
              this.drawerController.nativeElement.dispatchEvent(
                new Event('change')
              );
            }
          },
        },
        true
      )
      .enable();
  }

  // public disableScroll(v: Event) {
  //   const isChecked = (v.target as HTMLInputElement).checked;

  //   if (isChecked) {
  //     disableBodyScroll(document.body);
  //     return;
  //   }

  //   enableBodyScroll(document.body);
  // }
}
