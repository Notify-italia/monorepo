import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingComponent,
  NoteService,
  NoteViewComponent,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, NoteViewComponent],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  providers: [NoteService],
})
export class NoteComponent {
  private _noteService = inject(NoteService);
  private _activatedRoute = inject(ActivatedRoute);
  public note$ = this._noteService.getNotePublic(
    this._activatedRoute.snapshot.queryParamMap.get('n') || ''
  );
}
