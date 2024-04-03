import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { FileRecievedComponent } from './file-recieved.component';

@Injectable()
export class FileRecievedFactory extends BaseFactory {
  public create(
    file: {
      fileName: string;
      fileData: Buffer;
    },
    colors: INotifyProfile['colors']
  ) {
    return this._createComponent(FileRecievedComponent, {
      fileName: file.fileName,
      fileData: file.fileData,
      colors,
    });
  }
}
