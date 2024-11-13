import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../constructors';
import { UtilsService } from '../../../services';

export interface INotifyAdsBannerInteractions<D> {
  tooltip?: {
    type: 'hover' | 'always';
    value: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  bannerData?: D;
  onClick?: (v: D) => { closeModal: boolean };
}

@Component({
  selector: 'notify-ads-banner',
  standalone: true,
  imports: [CommonModule],
  providers: baseModalComponentProviders,
  templateUrl: './ads-banner.component.html',
  styleUrl: './ads-banner.component.scss',
})
export class AdsBannerComponent extends ModalBaseComponent {
  public _utilsService = inject(UtilsService);

  @Input() public desktopBanner = '';
  @Input() public mobileBanner = '';
  @Input() public interactions?: INotifyAdsBannerInteractions<unknown>;

  public get bannerUrl() {
    return this._utilsService.isMobile ? this.mobileBanner : this.desktopBanner;
  }

  public handleClickInteraction() {
    if (!this.interactions?.onClick) {
      return;
    }

    const result = this.interactions.onClick(this.interactions.bannerData);

    if (result.closeModal) {
      this.close();
    }
  }
}
