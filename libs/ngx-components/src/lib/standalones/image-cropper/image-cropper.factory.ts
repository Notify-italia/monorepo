import { Injectable, ViewContainerRef } from '@angular/core';
import {
  IImageCropperConfig,
  ImageCropperComponent,
} from './image-cropper.component';

@Injectable()
export class ImageCropperFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: IImageCropperConfig) {
    const ref = this.vcr.createComponent(ImageCropperComponent);
    ref.setInput('cf', ref);
    ref.setInput('config', config);
    return ref;
  }
}
