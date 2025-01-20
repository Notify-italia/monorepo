import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UtilsService } from '../../../../services';

@Component({
  selector: 'notify-mockup-fill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mockup-fill.component.html',
  styleUrls: ['./mockup-fill.component.scss', '../profile.styles.scss'],
})
export class MockupFillComponent {
  private _utilsService = inject(UtilsService);

  @Input() statusBarColor = 'white';

  public get textColor(): string {
    return this._utilsService.getContrastingColor(this.statusBarColor);
  }
}
