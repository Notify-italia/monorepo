import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgBoxIcon, SvgboxService } from '../../services';

@Component({
  selector: 'notify-svg-box-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-box-icon.component.html',
  styleUrls: ['./svg-box-icon.component.scss'],
})
export class SvgBoxIconComponent implements OnInit, OnChanges {
  private _domSanitizer = inject(DomSanitizer);
  public _platformId = inject(PLATFORM_ID);
  private _svgBox = inject(SvgboxService);

  @Input() public icon?: SvgBoxIcon;
  @Input() public iconName?: string;
  @Input() public size = 8;

  public visible = true;

  public isPlatformBrowser = isPlatformBrowser;

  public get sanitizedData() {
    if (!isPlatformBrowser(this._platformId)) {
      return '';
    }
    const data = this.icon?.data || '';
    if (!data) {
      return '';
    }
    return this._domSanitizer.bypassSecurityTrustHtml(data);
  }

  public ngOnInit() {
    this._getIcon();
  }

  public ngOnChanges() {
    this.visible = false;
    this._getIcon();
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  public get iconUrl() {
    if (!this.icon) {
      return this._svgBox.iconUrl(DEFAULT_ICON);
    }

    return this._svgBox.iconUrl(this.icon);
  }

  private _getIcon() {
    //TODO, per qualche ragione in public questa funzione ralletnta tutto il sito
    if (!this.iconName) {
      return;
    }

    this.icon = this._svgBox.availableIcons.find(
      (icon) => icon.name === this.iconName
    );

    if (!this.icon) {
      this.icon = DEFAULT_ICON;
    }
  }
}

const DEFAULT_ICON = {
  expanded: 'Question',
  name: 'question',
  tags: [],
  set: 'octicons',
  score: 10,
};
