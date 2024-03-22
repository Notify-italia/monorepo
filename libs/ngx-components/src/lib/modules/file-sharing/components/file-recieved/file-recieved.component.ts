import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { defaultGradientStops } from '../../../profile-player';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-recieved.component.html',
  styleUrl: './file-recieved.component.scss',
})
export class FileRecievedComponent {
  @Input() fileName?: string;
  @Input() fileData?: Buffer;
  @Input() colors: INotifyProfile['colors'] = {
    background: defaultGradientStops,
    elements: 'white',
    useCompanyColors: false,
  };
  @Input() cf!: ComponentRef<FileRecievedComponent>;

  constructor() {}

  @HostListener('document:keydown.escape')
  close() {
    this.cf.destroy();
  }

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
