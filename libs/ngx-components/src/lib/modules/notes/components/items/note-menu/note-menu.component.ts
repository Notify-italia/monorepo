import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { EnumNotifyNoteItemType } from '@notify/interfaces';
import { SvgBoxIcon } from '@notify/nfc-app-services';
import { SvgBoxIconComponent } from '../../../../../standalones/svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-note-menu',
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent],
  templateUrl: './note-menu.component.html',
  styleUrls: ['./note-menu.component.scss', '../../../notes.styles.scss'],
})
export class NoteMenuComponent {
  @Output() itemClick = new EventEmitter<EnumNotifyNoteItemType>();

  public itemTypes: {
    type: EnumNotifyNoteItemType;
    label: string;
    icon: SvgBoxIcon;
  }[] = [
    {
      type: EnumNotifyNoteItemType.Text,
      label: 'Testo',
      icon: {
        set: 'materialui',
        name: 'short_text',
      },
    },
    {
      type: EnumNotifyNoteItemType.Checklist,
      label: 'Checklist',
      icon: {
        set: 'octicons',
        name: 'checklist',
      },
    },
    {
      type: EnumNotifyNoteItemType.Link,
      label: 'Link',
      icon: {
        set: 'hero-solid',
        name: 'link',
      },
    },
    // {
    //   type: EnumNotifyNoteItemType.Files,
    //   label: 'Files',
    //   icon: {
    //     set: 'materialui',
    //     name: 'attach_file',
    //   },
    // },
    // {
    //   type: EnumNotifyNoteItemType.AudioRecord,
    //   label: 'Audio',
    //   icon: {
    //     set: 'hero-outline',
    //     name: 'microphone',
    //   },
    // },
  ];

  constructor() {}
}
