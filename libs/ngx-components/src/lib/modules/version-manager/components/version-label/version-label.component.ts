import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface INotifyVersionInfo {
  tag: string;
  date: string;
  title: string;
  description: string;
  artPath: string;
  changes: {
    type: 'fix' | 'improvement' | 'new';
    message: string;
  }[];
}

@Component({
  selector: 'notify-version-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-label.component.html',
  styleUrl: './version-label.component.scss',
})
export class VersionLabelComponent {
  @Input({ required: true }) currentVersion!: string;
  @Input({ required: true }) currentVersionDate!: string | Date;
  @Output() versionClick = new EventEmitter<void>();
}
