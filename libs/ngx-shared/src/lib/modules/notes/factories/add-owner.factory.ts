import { Injectable } from '@angular/core';
import { INotifyUser } from '@notify/interfaces';
import { Observable } from 'rxjs';
import { BaseFactory } from '../../../constructors/base.factory';
import { NoteAddOwnerComponent } from '../components/note-add-owner/note-add-owner.component';

@Injectable()
export class AddNoteOwnerFactory extends BaseFactory {
  public create(config: { users$: Observable<INotifyUser[]> }) {
    return this._createComponent(NoteAddOwnerComponent, config);
  }
}
