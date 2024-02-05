import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import Compressor from 'compressorjs';
import 'hammerjs';
import {
  ImageCroppedEvent,
  ImageCropperModule,
  ImageTransform,
} from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

export interface IImageCropperConfig {
  imageData: string;
  aspectRatio?: number;
  format?: 'png' | 'jpeg' | 'webp';
  minWidth?: number;
  minHeight?: number;
  alignImage?: 'center' | 'left';
  roundCropper?: boolean;
  onlyScaleDown?: boolean;
  containWithinAspectRatio?: boolean;
  resize?: {
    width: number;
    height: number;
  };
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperModule,
    SvgBoxIconComponent,
    LoadingComponent,
  ],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
})
export class ImageCropperComponent implements OnInit {
  @Input({ required: true }) config!: IImageCropperConfig;
  @Input() cf!: ComponentRef<ImageCropperComponent>;

  public value!: Blob;
  public transform: ImageTransform = {};

  public loading = true;

  public submitted = new Subject<string>();
  public destroyed = new Subject<void>();

  public async ngOnInit() {
    this.value = await this._base64ToBlob(this.config.imageData);
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  rotateLeft() {
    if (!this.transform.rotate) {
      this.transform.rotate = 0;
    }

    this.transform = {
      ...this.transform,
      rotate: this.transform.rotate - 90,
    };
  }

  rotateRight() {
    if (!this.transform.rotate) {
      this.transform.rotate = 0;
    }

    this.transform = {
      ...this.transform,
      rotate: this.transform.rotate + 90,
    };
  }

  @HostListener('document:keydown.escape')
  close() {
    this.cf.destroy();
    this.destroyed.next();
  }

  async submit() {
    const compressedImage = await this._compressImage();
    const ab = await compressedImage.arrayBuffer();

    this.submitted.next(await this._arrayBufferToBase64(ab));
    this.cf.destroy();
  }

  private async _compressImage() {
    const result = new Promise<File>((resolve) => {
      new Compressor(this.value, {
        quality: 0.6,
        success: (result) => {
          return resolve(result as File);
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    });

    return result;
  }

  async imageCropped(event: ImageCroppedEvent) {
    if (!event.blob) {
      return;
    }

    this.value = event.blob;
  }

  private async _arrayBufferToBase64(buffer: ArrayBuffer) {
    //arraybuffer to blob
    const blob = new Blob([buffer]);

    const result = new Promise<string | ArrayBuffer | null>((resolve) => {
      //blob to base64 without using FileReader
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        return resolve(reader.result as string);
      };
    });

    return result as Promise<string>;
  }

  private async _base64ToBlob(base64: string) {
    const result = new Promise<Blob>((resolve) => {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: 'image/png' });

      return resolve(blob);
    });

    return result;
  }
}
