import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import {
  EnumNotifyAPBackgroundTypes,
  INotifyAdvancedProfileItem,
  INotifyProfile,
} from '@notify/interfaces';
import { Subject } from 'rxjs';
import { FormsService, UtilsService } from '../../services';
import { PagePlayerComponent } from './items/page/page.player.component';
import { AdvancedProfileItemOutputsService } from './services/advanced-profile-item-outputs.service';
import { AdvancedProfileItemsService } from './services/advanced-profile-items.service';

@Component({
  selector: 'notify-ap-player',
  standalone: true,
  imports: [CommonModule, PagePlayerComponent, DragDropModule],
  providers: [AdvancedProfileItemsService, FormsService],
  templateUrl: './ap.player.component.html',
  styles: `
  .cdk-drag-preview {
    @apply bg-gray-500/50  rounded-lg overflow-hidden;

      &>div {
        @apply opacity-0;
      
      }
  }
  `,
})
export class AdvancedProfilePlayerComponent {
  private _apItems = inject(AdvancedProfileItemsService);
  public utilsSerivce = inject(UtilsService);
  public apItemOutputs = inject(AdvancedProfileItemOutputsService);

  @Input() profile!: INotifyProfile;
  @Input() contained = false;
  @Input() isRunningOnPlayer = false;
  @Input() footer?: SafeHtml;
  @Input() environment: Record<string, unknown> = {};

  @Output() itemClicked = new Subject<INotifyAdvancedProfileItem>();

  public get background() {
    return this._apItems.getSystemManifests('background');
  }

  public get advancedProfile() {
    return this.profile.advancedProfile;
  }

  public get itemContainerStyles() {
    if (!this.pageSettings) {
      return {};
    }

    const _baseStyles = {
      'padding-left': this.pageSettings?.padding + 'rem',
      'padding-right': this.pageSettings?.padding + 'rem',
    };

    if (
      this.pageSettings.backgroundType !== EnumNotifyAPBackgroundTypes.Image
    ) {
      return _baseStyles;
    }

    return {
      'backdrop-filter': `blur(${
        this.pageSettings?.backgroundBlur
      }px) brightness(${this.pageSettings?.backgroundBrightness / 100})`,
      ..._baseStyles,
    };
  }

  public get pageSettings() {
    if (this.profile.advancedProfile?.pageSettings.useCompanyTheme) {
      return this.profile.company?.advancedProfile?.pageSettings;
    }

    return this.advancedProfile?.pageSettings;
  }

  public get verticalSpacing() {
    const value = this.advancedProfile?.pageSettings.verticalSpacing || 0;

    return `${value}rem`;
  }

  public dropMainList(event: CdkDragDrop<string[]>) {
    const items = this.profile.advancedProfile?.items || [];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.apItemOutputs.onHierarchyChanged(items);
  }

  public get advancedProfileItems() {
    return this.advancedProfile?.items.map((i) => ({
      data: i,
      manifest: this._apItems.getManifest(i.type),
    }));
  }
}
