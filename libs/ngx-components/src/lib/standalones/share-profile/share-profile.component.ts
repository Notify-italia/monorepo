import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { INotifyProfile } from 'libs/notify-interfaces/src';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { NfcWriteComponent } from '../nfc-write/nfc-write.component';
@Component({
  selector: 'notify-share-profile',
  standalone: true,
  imports: [CommonModule, QRCodeModule, LightboxModule, NfcWriteComponent],
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss'],
})
export class ShareProfileComponent {
  @Input() public profile?: INotifyProfile;
  @Input() public publicProfileUrl = 'http://localhost:4200/profile';

  public nfcEnabled = /android/i.test(navigator.userAgent.toLowerCase());

  constructor(private _lightbox: Lightbox, private _toastr: ToastrService) {}

  public async copyToClipboard() {
    await navigator.clipboard.writeText(this.publicProfileUrl);
    this._toastr.info('URL Copiato');
  }

  public async openLightbox() {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data=${encodeURIComponent(
      this.publicProfileUrl
    )}`;

    this._lightbox.open(
      [
        {
          src: qr,
          caption: 'notify-qrcode',
          thumb: qr,
        },
      ],
      0,
      {
        disableScrolling: true,
        centerVertically: true,
        showDownloadButton: true,
        fitImageInViewPort: true,
      }
    );
  }
}
