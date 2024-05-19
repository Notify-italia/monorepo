import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalBaseComponent } from '../../../constructors';
import { CachedSrcDirective } from '../../../directives';
import { CapacitorService } from '../../../services';

export interface IFrameModalNavbarStyle {
  backgroundColor: string;
  color: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, CachedSrcDirective],
  providers: [CapacitorService],
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IFrameComponent extends ModalBaseComponent {
  @Input() url = '';
  @Input() title = 'IFrame';
  @Input() navbarStyle: IFrameModalNavbarStyle = {
    backgroundColor: '#3ABA8F',
    color: '#ffffff',
  };

  constructor() {
    super();
    this._loadCustomElementsScript();
    this._loadXframeBypass();
  }

  private _loadCustomElementsScript() {
    const node = document.createElement('script');
    node.src = 'https://unpkg.com/@ungap/custom-elements-builtin';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  private _loadXframeBypass() {
    const node = document.createElement('script');
    node.src = 'https://s3-api.vps.notifyapp.it/assets/x-frame-bypass.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
