import { Component, inject } from '@angular/core';
import { INotifyAPNoteItem, NotifyPopulatedNote } from '@notify/interfaces';
import { Subject, of, switchMap, tap } from 'rxjs';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { NoteService } from '../../../../services';
import { NoteViewComponent } from '../../../notes';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports, NoteViewComponent],
  providers: [...AdvancedItemPlayerBaseProviders, NoteService],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      @if (noteSubject$ |async; as note) {
      <notify-note-view
        [note]="note"
        [options]="{
          showTitle: false,
          textColor: context.getters.textColor
        }"
      ></notify-note-view>
      }
    </div>
  `,
})
export class NotePlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPNoteItem> {
  private _noteService = inject(NoteService);

  public noteSubject$ = new Subject<NotifyPopulatedNote | null>();

  public override componentReady(): void {
    this._getNote().subscribe();

    this.context.getters.componentChanged$
      .pipe(switchMap(() => this._getNote()))
      .subscribe();
  }

  private _getNote() {
    const note = this.context.getters.currentItem.note;

    if (!note) {
      this.noteSubject$.next(null);
      return of();
    }

    return this._noteService
      .getNotePublic(this.context.getters.currentItem.note)
      .pipe(tap((note) => this.noteSubject$.next(note)));
  }
}
