import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { EnumNotifyProfileSources } from '@notify/interfaces';
import { CapacitorService } from '../../../../services';

import { ToastrService } from 'ngx-toastr';

import { QrcodeFactory } from '../../../modals';
import { NfcWriteFactory } from '../../../modals/nfc-write';

export interface INotifyShareItemConfig {
  type: 'profile' | 'note';
  qrcode: {
    title?: string;
    fileName: string;
  };
  nfc: {
    questionLabel?: string;
    confirmationLabel?: string;
    items: {
      value: string;
      label: string;
    }[];
  };
  baseUrl: string;
  isInModal: boolean;
  id: string;
}

@Component({
  selector: 'notify-share-item',
  standalone: true,
  imports: [CommonModule],
  providers: [NfcWriteFactory, CapacitorService, QrcodeFactory],
  styles: `button {
    @apply bg-primary-500/20 text-white/80 border-none;
  }

  svg {
    @apply w-6 h-6;
  }
  `,
  templateUrl: './share-item.component.html',
})
export class ShareItemComponent {
  @Input() public config!: INotifyShareItemConfig;
  @Input() public compact = false;

  public hasShare = !!navigator.share;
  public isNative = this.capacitor.isNative;

  public get compactConditionalClasses() {
    // height: 2rem/* 32px */;
    // min-height: 2rem/* 32px */;
    // padding-left: 0.75rem/* 12px */;
    // padding-right: 0.75rem/* 12px */;
    // font-size: 0.875rem/* 14px */;
    const { compact } = this;
    return {
      container: {
        'p-4 ': !compact,
        'p-2': compact,
      },
      button: {
        'h-[2.5rem] min-h-[2.5rem] text-[0.875rem] w-[2.5rem]': compact,
      },
      svg: {
        '!w-4 !h-4': compact,
      },
    };
  }

  constructor(
    private _toastr: ToastrService,
    private _nfcFactory: NfcWriteFactory,
    private _qrcode: QrcodeFactory,
    public capacitor: CapacitorService
  ) {}

  public async copyToClipboard() {
    await navigator.clipboard.writeText(
      this._genPlayerUrl(EnumNotifyProfileSources.URL)
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
        url: this._genPlayerUrl(EnumNotifyProfileSources.URL),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  public async openQRCode() {
    this._qrcode.create({
      data: this._genPlayerUrl(EnumNotifyProfileSources.QR),
      size: 350,
      title: this.config.qrcode.title || 'Condividi Profilo',
      filename: this.config.qrcode.fileName,
      blurBackground: !this.config.isInModal,
    });
  }

  public async writeNfc() {
    this._nfcFactory.create({
      ...this.config.nfc,
      blurBackground: !this.config.isInModal,
      playerBaseUrl: this.config.baseUrl,
    });
  }

  private _genPlayerUrl(source: EnumNotifyProfileSources) {
    const _source = this.config.type === 'profile' ? `&s=${source}` : '';
    return (
      `${this.config.baseUrl}/${this.config.type}?p=${this.config.id}` + _source
    );
  }
}
