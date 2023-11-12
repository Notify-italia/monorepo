import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { QRCodeModule } from 'angularx-qrcode';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { NfcWriteComponent } from '../nfc-write.component';
@Component({
  selector: 'notify-share-profile',
  standalone: true,
  imports: [CommonModule, QRCodeModule, LightboxModule, NfcWriteComponent],
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss'],
})
export class ShareProfileComponent implements OnInit {
  @Input() public profile?: INotifyProfile;

  public nfcEnabled = /android/i.test(navigator.userAgent.toLowerCase());
  private _publicUrl = 'https://app.notify.it/profile/';

  constructor(private _lightbox: Lightbox, private _toastr: ToastrService) {}

  ngOnInit(): void {
    this._publicUrl += this.profile?._id;
  }

  public async copyToClipboard() {
    await navigator.clipboard.writeText(this._publicUrl);
    this._toastr.success('URL Copiato');
  }

  public async openLightbox() {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
      this._publicUrl
    )}.png`;

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
