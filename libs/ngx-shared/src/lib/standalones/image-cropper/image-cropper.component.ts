import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Compressor from 'compressorjs';

import {
  CropperSettings,
  ImageCropperComponent as ImgCropperComponent,
  ImageCropperModule as ImgCropperModule,
} from 'ngx-img-cropper';
import { Subject } from 'rxjs';
import { ModalBaseComponent } from '../../constructors/modal.base.component';
import { LoadingComponent } from '../loading/loading.component';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

export interface IImageCropperConfig {
  imageData: File;
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
    SvgBoxIconComponent,
    LoadingComponent,
    ImgCropperModule,
  ],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
})
export class ImageCropperComponent
  extends ModalBaseComponent
  implements AfterViewInit, OnInit
{
  @ViewChild('IMGCropper') cropper!: ImgCropperComponent;

  @Input({ required: true }) config!: IImageCropperConfig;

  public value!: {
    original: string;
    image: string; // base64
    size: number; // bytes
    type: string; // image/png
  };

  public loading = true;

  public submitted = new Subject<string>();

  public cropperSettings?: CropperSettings;

  public ngOnInit(): void {
    this.cropperSettings = new CropperSettings();

    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.canvasWidth = 400;

    this.cropperSettings.rounded = !!this.config.roundCropper;
    this.cropperSettings.minWidth = this.config.minWidth || 10;
    this.cropperSettings.minHeight = this.config.minHeight || 10;

    this.cropperSettings.croppedWidth = this.config.resize?.width || 0;
    this.cropperSettings.croppedHeight = this.config.resize?.height || 0;
    this.cropperSettings.preserveSize = !this.config.resize;
    this.cropperSettings.keepAspect = !!this.config.resize;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.fileType = `image/${this.config.format || 'webp'}`;
  }

  public async ngAfterViewInit() {
    const image = new Image();
    const reader = new FileReader();

    reader.onloadend = async (e) => {
      image.src = e.target?.result as string;

      if (!image) {
        return;
      }

      this.cropper.setImage(image);
      this.value = {
        original: image.src,
        image: image.src,
        size: this.config.imageData.size,
        type: this.config.imageData.type,
      };
    };

    reader.readAsDataURL(this.config.imageData);
  }

  override onClose(): void {
    this.destroyed$.next();
  }

  async submit() {
    const compressedImage = await this._compressImage();
    const ab = await compressedImage.arrayBuffer();

    this.submitted.next(await this._arrayBufferToBase64(ab));
    this.cf.destroy();
  }

  private async _compressImage() {
    const imgBlob = await this._base64ToBlob(this.value.image);

    const result = new Promise<File>((resolve) => {
      new Compressor(imgBlob, {
        quality: 0.6,
        width: 800,
        height: 800,
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
