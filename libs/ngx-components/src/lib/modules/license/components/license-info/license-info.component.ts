import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { differenceInDays } from 'date-fns';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'notify-license-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss'],
})
export class LicenseInfoComponent {
  @Input() license?: INotifyLicense;

  @Output() daysLeft = new EventEmitter<number>();

  constructor(private _toastr: ToastrService) {}

  public get isExpired(): boolean {
    if (!this.license) {
      return true;
    }

    const { expirationDate } = this.license;

    const today = new Date();
    const expires = new Date(expirationDate);

    return today > expires;
  }

  public get remainingDays(): number {
    if (!this.license) {
      this.daysLeft.emit(0);
      return 0;
    }

    const { expirationDate } = this.license;

    let diffDays = differenceInDays(new Date(expirationDate), new Date());

    if (diffDays < 0) {
      diffDays = 0;
    }

    this.daysLeft.emit(diffDays);

    return diffDays;
  }

  public get publicKeySegmented() {
    if (!this.license) {
      return null;
    }

    const { publicKey } = this.license;

    return {
      segmented: publicKey.split('-'),
      dashes: publicKey.split('-').length - 1,
    };
  }

  public copyPublicKey() {
    if (!this.license) {
      return;
    }

    const { publicKey } = this.license;

    navigator.clipboard.writeText(publicKey);
    this._toastr.info('Licenza copiata');
  }
}
