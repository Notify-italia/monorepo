import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';

import { INotifyProfile } from '@notify/interfaces';
import { CapacitorService } from '@notify/nfc-app-services';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { NfcWriteFactory } from '../../modules/modals/nfc';
import { NfcWriteComponent } from '../../modules/modals/nfc/components/nfc-write/nfc-write.component';
@Component({
  selector: 'notify-share-profile',
  standalone: true,
  imports: [CommonModule, QRCodeModule, LightboxModule, NfcWriteComponent],
  providers: [NfcWriteFactory, CapacitorService],
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss'],
})
export class ShareProfileComponent {
  @Input({ required: true }) public profile!: INotifyProfile;
  @Input({ required: true }) public playerUrl = 'http://localhost:4200/profile';

  constructor(
    private _lightbox: Lightbox,
    private _toastr: ToastrService,
    private _nfcFactory: NfcWriteFactory,
    public capacitor: CapacitorService
  ) {}

  public async copyToClipboard() {
    await navigator.clipboard.writeText(this.playerUrl);
    this._toastr.info('URL Copiato');
  }

  public async openLightbox() {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?format=svg&size=500x500&data=${encodeURIComponent(
      this.playerUrl
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

  public async writeNfc() {
    this._nfcFactory.create({ value: this.playerUrl });
  }
}
