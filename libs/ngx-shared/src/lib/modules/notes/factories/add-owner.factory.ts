import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyUser } from '@notify/interfaces';
import { Observable } from 'rxjs';
import { NoteAddOwnerComponent } from '../components/note-add-owner/note-add-owner.component';

@Injectable()
export class AddNoteOwnerFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: { users$: Observable<INotifyUser[]> }) {
    const ref = this.vcr.createComponent(NoteAddOwnerComponent);

    ref.setInput('cf', ref);
    ref.setInput('users$', config.users$);

    return ref;
  }
}
