import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

const LATEST_SEEN_CHANGELOG_KEY = 'latestSeenChangelog';

@Component({
  selector: 'notify-version-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-label.component.html',
  styleUrl: './version-label.component.scss',
})
export class VersionLabelComponent implements OnInit {
  @Input({ required: true }) currentVersion!: string;
  @Input({ required: true }) currentVersionDate!: string | Date;
  @Output() versionClick = new EventEmitter<void>();

  public get hasSeenChangelog(): boolean {
    return (
      localStorage.getItem(LATEST_SEEN_CHANGELOG_KEY) === this.currentVersion
    );
  }

  ngOnInit(): void {
    if (this.hasSeenChangelog) {
      return;
    }

    this.versionClick.emit();
    localStorage.setItem(LATEST_SEEN_CHANGELOG_KEY, this.currentVersion);
  }
}
