import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgBoxIcon } from '../../../../services';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-widget-counter',
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent],
  templateUrl: './widget-counter.component.html',
  styleUrls: ['./widget-counter.component.scss', '../../widgets.styles.scss'],
})
export class WidgetCounterComponent {
  @Input({ required: true }) public count = 0;
  @Input({ required: true }) public backgroundColor!: string;
  @Input({ required: true }) public icon!: SvgBoxIcon;
  @Input({ required: true }) public elementsColor!: string;
  @Input({ required: true }) public title!: string;
  @Input() public tooltip?: string;
  @Input() countSuffix = '';
}
