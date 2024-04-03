import { Injectable } from '@angular/core';
import { BaseFactory } from '../../constructors/base.factory';
import {
  IImageCropperConfig,
  ImageCropperComponent,
} from './image-cropper.component';

@Injectable()
export class ImageCropperFactory extends BaseFactory {
  public create(config: IImageCropperConfig) {
    return this._createComponent(ImageCropperComponent, {
      config,
    });
  }
}
