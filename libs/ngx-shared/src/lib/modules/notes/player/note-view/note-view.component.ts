import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  EnumNotifyNoteItemType,
  INotifyProfile,
  NotifyPopulatedNote,
} from '@notify/interfaces';
import { NotePlayerChecklistItemComponent } from '../items/note-player-checklist-item.component';
import { NotePlayerFilesItemComponent } from '../items/note-player-files-item.component';
import { NotePlayerLinkItemComponent } from '../items/note-player-link-item.component';
import { NotePlayerPhotoItemComponent } from '../items/note-player-photo-item.component';
import { NotePlayerTextItemComponent } from '../items/note-player-text-item.component';

@Component({
  selector: 'notify-note-view',
  standalone: true,
  imports: [
    CommonModule,
    NotePlayerLinkItemComponent,
    NotePlayerPhotoItemComponent,
    NotePlayerTextItemComponent,
    NotePlayerChecklistItemComponent,
    NotePlayerFilesItemComponent,
  ],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.scss',
})
export class NoteViewComponent {
  @Input({ required: true }) note!: NotifyPopulatedNote;
  @Input() options?: INotifyProfile['noteOptions'] & { textColor: string };

  public enumNoteItemTypes = EnumNotifyNoteItemType;
}
