import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  INotifyAPLinksItem,
  INotifyAdvancedProfile,
  NOTIFY_ITEM_TYPES_IT,
} from '@notify/interfaces';

@Component({
  selector: 'notify-hierarchy',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './hierarchy.component.html',
  styleUrls: [
    './hierarchy.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class HierarchyComponent {
  @Input() selectedHierarchyItem?: string;
  @Input() hierarchy: INotifyAdvancedProfile['items'] = [];

  @Output() hierarchyChanged = new EventEmitter<
    INotifyAdvancedProfile['items']
  >();
  @Output() selectedHierarchyItemChanged = new EventEmitter<string>();

  public get hierarchyItems() {
    return this.hierarchy.map((item) => ({
      label: NOTIFY_ITEM_TYPES_IT[item.type],
      _id: item._id,
      icon: [],
      subItems: (item as INotifyAPLinksItem).items?.map((subItem) => ({
        label: subItem.caption,
      })),
    }));
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
