import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { CapacitorService } from '@notify/nfc-app-services';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  providers: [CapacitorService],
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrcodeComponent implements OnInit {
  @Input() cf!: ComponentRef<QrcodeComponent>;
  @Input({ required: true }) data = '';
  @Input() size = 256;
  @Input() title = 'QR Code';
  @Input() filename = 'qrcode.png';

  private _storedBrightness: GetBrightnessReturnValue = { brightness: 0 };

  public get qrcodeDataUrl() {
    return `https://api.qrserver.com/v1/create-qr-code/?format=png&size=500x500&data=${encodeURIComponent(
      this.data
    )}`;
  }

  constructor(
    private _capacitorService: CapacitorService,
    private _toastr: ToastrService
  ) {}

  async ngOnInit() {
    this._storedBrightness = await this._capacitorService.brightness;
    console.log(this._storedBrightness);
    this._capacitorService.setBrightness(1);
  }

  @HostListener('document:keydown.escape')
  close() {
    this._capacitorService.setBrightness(this._storedBrightness.brightness);
    this.cf.destroy();
  }

  saveAsImage(parent: QRCodeComponent) {
    // fetches base 64 date from image
    const parentElement = parent.qrcElement.nativeElement
      .querySelector('canvas')
      .toDataURL('image/png');

    // converts base 64 encoded image to blobData
    const blobData = this.convertBase64ToBlob(parentElement);

    const blob = new Blob([blobData], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);

    if (this._capacitorService.isNative) {
      this._capacitorService
        .saveImage({
          filename: `${this.filename}.png`,
          data: parentElement,
        })
        .then(() => {
          this._toastr.info('Immagine salvata nella galleria');
        });

      return;
    }

    // window.open(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.filename;
    link.click();
  }

  private convertBase64ToBlob(Base64Image: string) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }
}
