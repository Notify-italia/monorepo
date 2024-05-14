import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
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

  @Input() public icon?: SvgBoxIcon;
  @Input() public iconName?: string;
  @Input() public size = 8;

  public visible = true;

  public get sanitizedData() {
    const data = this.icon?.data || '';

    if (!data) {
      return '';
    }

    return this._domSanitizer.bypassSecurityTrustHtml(data);
  }

  constructor(private _svgBox: SvgboxService) {}

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
      return '';
    }

    return this._svgBox.iconUrl(this.icon);
  }

  private _getIcon() {
    if (!this.iconName) {
      return;
    }

    this.icon = this._svgBox.availableIcons.find(
      (icon) => icon.name === this.iconName
    );

    if (!this.icon) {
      this.icon = {
        expanded: 'Question',
        name: 'question',
        tags: [],
        set: 'octicons',
        score: 10,
      };
    }
  }
}
