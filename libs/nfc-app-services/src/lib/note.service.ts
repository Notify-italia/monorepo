import { Injectable } from '@angular/core';
import { INotifyNote } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class NoteService {
  constructor(private http: HttpService) {}

  public postNote() {
    return this.http.post<Record<string, unknown>, INotifyNote>(
      '/v1/notes',
      {}
    );
  }

  public getNote(id: string) {
    return this.http.get<INotifyNote>(`/v1/notes`, { id });
  }

  public getNotes() {
    return this.http.get<INotifyNote[]>(`/v1/notes`);
  }

  public patchNote(id: string, note: INotifyNote) {
    return this.http.patch<{ note: INotifyNote }, INotifyNote>(
      `/v1/notes`,
      { note },
      { id }
    );
  }
}
