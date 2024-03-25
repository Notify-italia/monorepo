import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { SvgboxService, UtilsService } from '../../../../services';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-profile-integrations',
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent],
  providers: [SvgboxService, UtilsService],
  templateUrl: './profile-integrations.component.html',
  styleUrls: [
    './profile-integrations.component.scss',
    '../profile.styles.scss',
  ],
})
export class ProfileIntegrationsComponent {
  @Input() data?: INotifyProfile['customFields'];
  @Input() color: INotifyProfile['colors']['elements'] = '#ffffff';

  @Output() public integrationClicked = new EventEmitter<
    INotifyProfile['customFields'][0]
  >();

  constructor(
    private _svgBoxService: SvgboxService,
    private _utils: UtilsService
  ) {}

  public getExpandedName(name: string): string {
    return this._svgBoxService.getIcon(name)?.expanded || name;
  }

  public prepareUrl(url: string, icon: string): string {
    const selectedIcon = this._svgBoxService.availableIcons.find(
      (i) => i.name === icon
    );

    if (!selectedIcon) {
      return url;
    }

    return this._utils.populateWebProtocol(
      selectedIcon.prefix || 'https://',
      url
    );
  }
}
