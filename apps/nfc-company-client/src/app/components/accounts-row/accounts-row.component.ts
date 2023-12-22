import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyAgent } from '@notify/interfaces';
import { AvatarComponent } from '@notify/ngx-components';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[notify-accounts-row]',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './accounts-row.component.html',
  styleUrls: ['./accounts-row.component.scss'],
})
export class AccountsRowComponent {
  @Input({ required: true }) public user!: INotifyAgent;

  @Output() public inspectProfile = new EventEmitter<void>();
  @Output() public showUserForm = new EventEmitter<void>();
  @Output() public deleteUser = new EventEmitter<void>();

  public placeholderAvatar =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
}
