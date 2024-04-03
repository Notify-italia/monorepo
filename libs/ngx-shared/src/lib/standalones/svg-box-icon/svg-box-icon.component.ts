import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SvgBoxIcon, SvgboxService } from '../../services';

@Component({
  selector: 'notify-svg-box-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-box-icon.component.html',
  styleUrls: ['./svg-box-icon.component.scss'],
})
export class SvgBoxIconComponent implements OnInit, OnChanges {
  @Input() public icon?: SvgBoxIcon;
  @Input() public iconName?: string;
  @Input() public size: number = 8;

  constructor(private _svgBox: SvgboxService) {}

  public ngOnInit() {
    this._getIcon();
  }

  public ngOnChanges() {
    this._getIcon();
  }

  public genIconUrl() {
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
