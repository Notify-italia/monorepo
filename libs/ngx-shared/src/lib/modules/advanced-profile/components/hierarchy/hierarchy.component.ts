import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { INotifyAPLinksItem, INotifyAdvancedProfile } from '@notify/interfaces';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-hierarchy',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  providers: [AdvancedProfileItemsService],
  templateUrl: './hierarchy.component.html',
  styleUrls: [
    './hierarchy.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class HierarchyComponent {
  private _apItemsService = inject(AdvancedProfileItemsService);

  @Input() selectedHierarchyItem = 'background';
  @Input() hierarchy: INotifyAdvancedProfile['items'] = [];

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
        icon: manifest.outlineIcon,
        subItems: (item as INotifyAPLinksItem).items?.map((subItem) => ({
          label: subItem.caption,
        })),
      };
    });
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
