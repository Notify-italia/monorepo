import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import Compressor from 'compressorjs';

import Cropper from 'cropperjs';

import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../constructors/modal.base.component';
import { LoadingComponent } from '../loading/loading.component';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

export interface IImageCropperConfig {
  imageData: File;
  aspectRatio?: number;
  resize?: {
    width: number;
    height: number;
  };
}

@Component({
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent, LoadingComponent],
  providers: baseModalComponentProviders,
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
})
export class ImageCropperComponent
  extends ModalBaseComponent<string>
  implements AfterViewInit
{
  @ViewChild('IMGCropper') cropperContainer!: ElementRef<HTMLImageElement>;
  @Input({ required: true }) config!: IImageCropperConfig;

  public cropper?: Cropper;
  public croppedImage = '';

  public currentRotation = 0;
  public flippedHorizontal = false;
  public flippedVertical = false;

  public loading = true;

  public get advancedProfileParent() {
    return document.querySelector(
      '#advanced-profile-info-panel'
    ) as HTMLDivElement;
  }

  public ngAfterViewInit(): void {
    this.cropper = new Cropper(this.cropperContainer.nativeElement, {
      aspectRatio: this.config.aspectRatio || 1,
      dragMode: 'move',
      viewMode: 2,
      toggleDragModeOnDblclick: false,
      ready: () => {
        this.loading = false;
        this.croppedImage =
          this.cropper?.getCroppedCanvas().toDataURL('image/jpeg') || '';
      },
    });

    this.cropperContainer.nativeElement.addEventListener('cropend', () => {
      if (!this.cropper) {
        return;
      }
      this.croppedImage = this.cropper
        ?.getCroppedCanvas()
        .toDataURL('image/jpeg');
    });
  }

  override onClose(): void {
    console.log('advancedProfileParent', this.advancedProfileParent);

    if (!this.advancedProfileParent) {
      return;
    }
    this.advancedProfileParent.style.cssText = '';
  }

  async submit() {
    const compressedImage = await this._compressImage();
    const ab = await compressedImage.arrayBuffer();

    this.submitted.next(await this._arrayBufferToBase64(ab));
    this.close();
  }

  public flipHorizontal() {
    if (this.flippedHorizontal) {
      this.cropper?.scale(1, 1); // Flip horizontal back
      this.flippedHorizontal = !this.flippedHorizontal;
      return;
    }

    this.cropper?.scale(-1, 1); // Flip horizontal back
    this.flippedHorizontal = !this.flippedHorizontal;
  }

  public flipVertical() {
    if (this.flippedVertical) {
      this.cropper?.scale(1, 1); // Flip vertical back
      this.flippedVertical = !this.flippedVertical;
      return;
    }

    this.cropper?.scale(1, -1); // Flip vertical
    this.flippedVertical = !this.flippedVertical;
  }

  public rotateRight() {
    this.cropper?.rotateTo(this.currentRotation + 90);

    if (this.currentRotation === 270) {
      this.currentRotation = 0;
      return;
    }

    this.currentRotation += 90;
  }

  public rotateLeft() {
    this.cropper?.rotateTo(this.currentRotation - 90);

    if (this.currentRotation === 0) {
      this.currentRotation = 270;
      return;
    }

    this.currentRotation -= 90;
  }

  private async _compressImage() {
    const imgBlob = await this._base64ToBlob(this.croppedImage);

    const result = new Promise<File>((resolve) => {
      new Compressor(imgBlob, {
        quality: 0.4,
        width: this.config.resize?.width || 800,
        height: this.config.resize?.height || 800,
        mimeType: 'image/png',
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
