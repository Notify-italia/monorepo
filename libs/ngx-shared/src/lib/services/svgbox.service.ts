import { Injectable, afterNextRender } from '@angular/core';
import { DEFAULT_ICONSET } from '../constructors/iconset.base';

export interface SvgBoxIcon {
  expanded?: string;
  name: string;
  tags?: string[];
  set: string;
  score?: number;
  prefix?: string;
  placeholder?: string;
  publicPrefix?: string;
  data?: string;
  mask?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SvgboxService {
  public availableIcons: SvgBoxIcon[] = DEFAULT_ICONSET;

  constructor() {
    afterNextRender(() => {
      this._loadScript();
    });
  }

  public iconUrl(icon: SvgBoxIcon) {
    return `https://s2.svgbox.net/${icon.set}.svg?ic=${icon.name}`;
  }

  public getIcon(name: string, iconSet?: SvgBoxIcon[]): SvgBoxIcon {
    return (iconSet || this.availableIcons).find(
      (i) => i.name === name
    ) as SvgBoxIcon;
  }

  public setIconSet(icons: SvgBoxIcon[]) {
    this.availableIcons = icons;
  }

  private _loadScript() {
    const node = document.createElement('script');
    node.src = 'https://s3-api.vps.notifyapp.it/assets/svg-loader.min.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
