import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { INotifyNote } from '@notify/interfaces';

@Component({
  selector: 'notify-widget-note',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './widget-note.component.html',
  styleUrls: ['./widget-note.component.scss', '../../widgets.styles.scss'],
})
export class WidgetNoteComponent {
  @Input() public note?: INotifyNote;
}
