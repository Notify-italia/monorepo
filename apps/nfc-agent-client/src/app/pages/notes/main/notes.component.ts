import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from '@notify/interfaces';
import { NoteService } from '@notify/nfc-app-services';
import { PageHeaderComponent } from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  providers: [NoteService, ToastrService],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  constructor(
    private _router: Router,
    private _noteService: NoteService,
    private _toastrService: ToastrService
  ) {}

  handleHeaderAction(eventName: string) {
    if (eventName === 'addNote') {
      this._addNote();
    }
  }

  private _addNote() {
    this._noteService
      .postNote()
      .pipe(
        tap((note) => {
          this._router.navigate(['/pages/notes/inspect'], {
            queryParams: { id: note._id },
          });
        }),
        catchError(async (err: AppError) => {
          this._toastrService.error(err.error.errors[0].message, 'Error');
          return err;
        })
      )
      .subscribe();
  }
}
