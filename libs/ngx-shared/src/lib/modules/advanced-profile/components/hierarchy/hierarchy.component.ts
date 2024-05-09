import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EnumNotifyAPButtonStyles,
  EnumNotifyAPCorners,
  EnumNotifyAPDirections,
  EnumNotifyAdvancedProfileItems,
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
  @Input() hierarchy: INotifyAdvancedProfile['items'] = [
    {
      _id: '1',
      title: 'titolo',
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Avatar,
      direction: EnumNotifyAPDirections.Horizontal,
      subtitle: 'Avatar Subtitle 1',
      description: 'Avatar Description 1',
      imgSrc: 'https://example.com/avatar1.jpg',
      imgMask: 'square',
      ownerImgCorner: EnumNotifyAPCorners.None,
      ownerImgPath: 'https://example.com/owner1.jpg',
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '2',
      title: 'titolo',
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Feedback,
      caption: 'Feedback Caption 2',
      icon: 'https://example.com/feedback-icon2.png',
      url: 'https://example.com/feedback2',
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '3',
      title: 'titolo',
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Links,
      items: [
        {
          caption: 'Instagram',
          icon: 'https://example.com/link-icon3.png',
          url: 'https://example.com/link3',
        },
        {
          caption: 'LinkedIn',
          icon: 'https://example.com/link-icon4.png',
          url: 'https://example.com/link4',
        },
      ],
      style: EnumNotifyAPButtonStyles.Filled,
      direction: EnumNotifyAPDirections.Vertical,
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '4',
      title: 'titolo',
      showTitle: true,
      showStreetName: true,
      type: EnumNotifyAdvancedProfileItems.Place,
      address: '123 Main Street',
      city: 'Anytown',
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '5',
      title: 'titolo',
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Contacts,
      items: [
        {
          caption: 'Telefono',
          icon: 'https://example.com/contact-icon6.png',
          url: 'https://example.com/contact6',
        },
        {
          caption: 'Whatsapp',
          icon: 'https://example.com/contact-icon7.png',
          url: 'https://example.com/contact7',
        },
      ],
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '6',
      title: 'titolo',
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Photo,
      imgSrc: 'https://example.com/photo8.jpg',
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    {
      _id: '7',
      title: 'titolo',
      showNoteTitle: true,
      showTitle: true,
      type: EnumNotifyAdvancedProfileItems.Note,
      note: 'This is a note.',
      clickEvent: '',
      clickEventData: '',
      visible: true,
    },
    // Aggiungi altri elementi mockati se necessario
  ];

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
        _id: item._id,
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
