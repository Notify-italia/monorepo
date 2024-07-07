import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../../constructors/modal.base.component';
import { defaultGradientStops } from '../../../profile';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: baseModalComponentProviders,
  templateUrl: './file-recieved.component.html',
  styleUrl: './file-recieved.component.scss',
})
export class FileRecievedComponent extends ModalBaseComponent {
  @Input() fileName?: string;
  @Input() fileData?: Buffer;
  @Input() colors: INotifyProfile['colors'] = {
    background: defaultGradientStops,
    elements: 'white',
    useCompanyColors: false,
  };

  public downloadFile() {
    if (!this.fileData) {
      return;
    }

    const blob = new Blob([this.fileData]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.fileName || 'file';
    link.click();
    this.close();
  }
}
