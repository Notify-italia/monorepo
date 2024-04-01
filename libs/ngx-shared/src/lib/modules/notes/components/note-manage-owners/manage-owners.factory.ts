import { Injectable } from '@angular/core';
import { INotifyUser } from '@notify/interfaces';
import { Observable } from 'rxjs';
import { BaseFactory } from '../../../../constructors/base.factory';
import { NoteManageOwnersComponent } from './note-manage-owners.component';

@Injectable()
export class ManageNoteOwnersFactory extends BaseFactory {
  public create(config: {
    users$: Observable<INotifyUser[]>;
    skeletonRows: number;
  }) {
    return this._createComponent(NoteManageOwnersComponent, config);
  }
}
