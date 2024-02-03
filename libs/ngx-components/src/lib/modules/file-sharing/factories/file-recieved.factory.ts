import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { FileRecievedComponent } from '../components/file-recieved/file-recieved.component';

@Injectable()
export class FileRecievedFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(
    file: {
      fileName: string;
      fileData: Buffer;
    },
    colors: INotifyProfile['colors']
  ) {
    const ref = this.vcr.createComponent(FileRecievedComponent);
    ref.setInput('cf', ref);
    ref.setInput('fileName', file.fileName);
    ref.setInput('fileData', file.fileData);
    ref.setInput('colors', colors);

    return ref;
  }
}
