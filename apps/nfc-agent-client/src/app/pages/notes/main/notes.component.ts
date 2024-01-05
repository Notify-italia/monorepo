import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  constructor(private _router: Router) {}

  handleHeaderAction(eventName: string) {
    if (eventName === 'addNote') {
      this._router.navigate(['/pages/notes/add']);
    }
  }
}
