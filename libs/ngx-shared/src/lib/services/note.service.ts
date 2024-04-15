import { Injectable } from '@angular/core';
import { INotifyNote, UnknownObject } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class NoteService {
  constructor(private http: HttpService) {}

  public postNote() {
    return this.http.post<UnknownObject, INotifyNote>('/v1/notes', {});
  }

  public getNote(id: string) {
    return this.http.get<INotifyNote>(`/v1/notes`, { id });
  }

  public getLatestNote() {
    return this.http.get<INotifyNote>(`/v1/notes/latest`);
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

  public deleteNote(id: string) {
    return this.http.delete<INotifyNote>(`/v1/notes`, { id });
  }

  public uploadFile(
    file: string | ArrayBuffer | null,
    note: string,
    item: string,
    name: string
  ) {
    return this.http.post<
      {
        file: string | ArrayBuffer | null;
        note: string;
        item: string;
        name: string;
      },
      {
        url: string;
      }
    >('/v1/notes/file', {
      file,
      note,
      item,
      name,
    });
  }

  public deleteFile(note: string, item: string, name: string) {
    return this.http.delete<INotifyNote>(`/v1/notes/file`, {
      note,
      item,
      name,
    });
  }
}
