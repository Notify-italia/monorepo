import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SvgBoxIcon, SvgboxService } from '@notify/nfc-app-services';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';
import { TailwindFormsModule } from '../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-icon-selector',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, SvgBoxIconComponent],
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss'],
})
export class IconSelectorComponent implements OnInit {
  @Output() public icon = new EventEmitter<SvgBoxIcon>();

  public hideSelector = false;
  public availableIcons = this._svgBox.availableIcons;

  public MANUAL_REFRESH = true;

  public currentIcon: SvgBoxIcon = {
    expanded: 'Question',
    name: 'question',
    tags: [],
    set: 'octicons',
    score: 10,
  };

  constructor(private _svgBox: SvgboxService) {}

  public ngOnInit() {
    this.icon.emit(this.currentIcon);
  }

  public setIcon(icon: SvgBoxIcon) {
    this.currentIcon = icon;
    this.icon.emit(this.currentIcon);
    this.hideSelector = true;

    this._refresh();
  }

  private _refresh() {
    this.MANUAL_REFRESH = false;

    setTimeout(() => {
      this.MANUAL_REFRESH = true;
    }, 1);
  }
}
