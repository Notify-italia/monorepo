import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyUser } from '@notify/interfaces';
import { Observable } from 'rxjs';
import { NoteManageOwnersComponent } from '../components/note-manage-owners/note-manage-owners.component';

@Injectable()
export class ManageNoteOwnersFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: {
    users$: Observable<INotifyUser[]>;
    skeletonRows: number;
  }) {
    const ref = this.vcr.createComponent(NoteManageOwnersComponent);

    ref.setInput('cf', ref);
    ref.setInput('skeletonRows', config.skeletonRows);
    ref.setInput('users$', config.users$);

    return ref;
  }
}
