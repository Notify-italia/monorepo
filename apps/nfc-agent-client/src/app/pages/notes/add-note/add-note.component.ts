import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.scss',
})
export class AddNoteComponent {
  constructor(private _router: Router) {}

  handleHeaderAction(eventName: string) {
    if (eventName === 'back') {
      this._router.navigate(['/pages/notes']);
    }
  }
}
