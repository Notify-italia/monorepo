import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import 'hammerjs';
import {
  ImageCroppedEvent,
  ImageCropperModule,
  ImageTransform,
} from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

export interface IImageCropperConfig {
  imageData: string;
  aspectRatio?: number;
  format?: 'png' | 'jpeg' | 'webp';
  minWidth?: number;
  minHeight?: number;
  alignImage: 'center' | 'left';
  roundCropper?: boolean;
  onlyScaleDown?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, ImageCropperModule, SvgBoxIconComponent],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
})
export class ImageCropperComponent implements OnInit {
  @Input({ required: true }) config!: IImageCropperConfig;
  @Input() cf!: ComponentRef<ImageCropperComponent>;

  public currentImage = '';

  public transform: ImageTransform = {};

  public submitted = new Subject<string>();
  public destroyed = new Subject<void>();

  public ngOnInit() {
    this.currentImage = this.config.imageData;
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

  submit() {
    this.submitted.next(this.currentImage);
    this.cf.destroy();
  }

  async imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.currentImage = event.base64;
    }

    if (!event.blob) {
      return;
    }

    this.currentImage = await this._blobToBase64(event.blob);
  }

  private async _blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
