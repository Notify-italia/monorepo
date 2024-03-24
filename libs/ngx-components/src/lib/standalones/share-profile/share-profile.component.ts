import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';

import { EnumNotifyProfileSources, INotifyProfile } from '@notify/interfaces';
import { CapacitorService, ProfileService } from '@notify/nfc-app-services';

import { ToastrService } from 'ngx-toastr';
import { QrcodeFactory } from '../../modules/modals';
import { NfcWriteFactory } from '../../modules/modals/nfc';
import { NfcWriteComponent } from '../../modules/modals/nfc/components/nfc-write/nfc-write.component';
@Component({
  selector: 'notify-share-profile',
  standalone: true,
  imports: [CommonModule, QRCodeModule, NfcWriteComponent],
  providers: [NfcWriteFactory, CapacitorService, QrcodeFactory],
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss'],
})
export class ShareProfileComponent {
  @Input({ required: true }) public profile!: INotifyProfile;
  @Input({ required: true }) public baseUrl = 'http://localhost:4200/profile';

  public hasShare = !!navigator.share;
  public isNative = this.capacitor.isNative;

  constructor(
    private _toastr: ToastrService,
    private _nfcFactory: NfcWriteFactory,
    private _qrcode: QrcodeFactory,
    private _profileService: ProfileService,
    public capacitor: CapacitorService
  ) {}

  public async copyToClipboard() {
    await navigator.clipboard.writeText(
      this._profileService.genPlayerUrl(
        this.baseUrl,
        this.profile._id,
        EnumNotifyProfileSources.URL
      )
    );
    this._toastr.info('URL del profilo copiato');
  }

  public async share() {
    if (!navigator.share) {
      return;
    }
    try {
      return await navigator.share({
        title: 'Notify',
        text: 'Consulta il mio profilo su Notify!',
        url: this._profileService.genPlayerUrl(
          this.baseUrl,
          this.profile._id,
          EnumNotifyProfileSources.URL
        ),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  public async openQRCode() {
    this._qrcode.create({
      data: this._profileService.genPlayerUrl(
        this.baseUrl,
        this.profile._id,
        EnumNotifyProfileSources.QR
      ),
      size: 350,
      title: 'Condividi Profilo',
      filename: this.profile.name || 'qrcode',
    });
  }

  public async writeNfc() {
    this._nfcFactory.create({
      userProfile: this.profile._id,
      profilesUrl: this.baseUrl,
      companyProfile:
        this.profile.company?._id ||
        (this.profile.company as unknown as string),
    });
  }
}
