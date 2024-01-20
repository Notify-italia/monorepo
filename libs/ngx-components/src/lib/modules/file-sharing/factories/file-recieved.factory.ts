import { Injectable, ViewContainerRef } from '@angular/core';
import { FileRecievedComponent } from '../components/file-recieved/file-recieved.component';

@Injectable()
export class FileRecievedFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: { fileName: string; fileData: Buffer }) {
    const ref = this.vcr.createComponent(FileRecievedComponent);
    ref.setInput('cf', ref);
    ref.setInput('fileName', config.fileName);
    ref.setInput('fileData', config.fileData);

    return ref;
  }
}
