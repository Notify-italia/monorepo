import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  INotifyAPContactsItem,
  INotifyAPLinksItem,
  INotifyAdvancedProfile,
} from '@notify/interfaces';
import { Subscription, delay, of } from 'rxjs';
import { CapacitorService, UtilsService } from '../../../../services';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-hierarchy',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  providers: [AdvancedProfileItemsService, CapacitorService, UtilsService],
  templateUrl: './hierarchy.component.html',
  styleUrls: [
    './hierarchy.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class HierarchyComponent {
  private _apItemsService = inject(AdvancedProfileItemsService);
  public utilsService = inject(UtilsService);
  private _capacitorService = inject(CapacitorService);
  private _dragtimer: Subscription | null = null;

  @Input() selectedHierarchyItem = 'background';
  @Input() requiredItems: string[] = [];
  @Input() hierarchy: INotifyAdvancedProfile['items'] = [];
  @Input() redirectEnabled = false;

  @Output() hierarchyChanged = new EventEmitter<
    INotifyAdvancedProfile['items']
  >();
  @Output() selectedHierarchyItemChanged = new EventEmitter<string>();

  public get hierarchyItems() {
    return this.hierarchy.map((item) => {
      const manifest = this._apItemsService.getManifest(item.type);
      return {
        label: item.title || manifest.localizedName,
        _id: item._id,
        visible: item.visible,
        icon: manifest.outlineIcon,
        required: this.requiredItems.includes(item._id),
        subItems: (
          item as INotifyAPLinksItem | INotifyAPContactsItem
        ).items?.map((subItem) => ({
          label: subItem.caption || 'Elemento',
          visible: subItem.visible,
        })),
      };
    });
  }

  public get cdkDragDelay() {
    if (this.utilsService.isMobile) {
      return 500;
    }

    return 0;
  }

  startDragTimer(ref: HTMLElement): void {
    if (!this.utilsService.isMobile) {
      return;
    }
    this._dragtimer?.unsubscribe();
    this._dragtimer = of(null)
      .pipe(delay(this.cdkDragDelay))
      .subscribe(() => {
        console.log('dragging');
        this._capacitorService.triggerHapticFeedback(
          this._capacitorService.hFeedbackStyles.Medium
        );

        ref.dispatchEvent(
          new TouchEvent('touchmove', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      });
  }

  stopDragTimer(): void {
    if (!this.utilsService.isMobile) {
      return;
    }

    this._dragtimer?.unsubscribe();
    this._dragtimer = null;
  }

  public dropMainList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.hierarchy, event.previousIndex, event.currentIndex);
    this.hierarchyChanged.emit(this.hierarchy);
  }

  public dropSubList(event: CdkDragDrop<string[]>, index: number) {
    moveItemInArray(
      (this.hierarchy[index] as INotifyAPLinksItem)?.items,
      event.previousIndex,
      event.currentIndex
    );
    this.hierarchyChanged.emit(this.hierarchy);
  }

  public selectHierarchyItem(item: string) {
    this.selectedHierarchyItem = item;
    this.selectedHierarchyItemChanged.emit(item);
  }
}
