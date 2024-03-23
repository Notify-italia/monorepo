import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { INotifyVersionInfo } from '../version-label/version-label.component';
@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
})
export class ChangelogComponent implements OnInit {
  @Input() versionInfo!: INotifyVersionInfo;
  @Input() cf!: ComponentRef<ChangelogComponent>;

  private get _parentElement() {
    return (this.cf.location.nativeElement as HTMLElement)
      .parentElement as HTMLElement;
  }

  close() {
    enableBodyScroll(this._parentElement);
    this.cf.destroy();
  }

  constructor(private _domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    disableBodyScroll(this._parentElement);
  }

  public get changelogSorted() {
    const changes = this.versionInfo.changes
      .sort((a, b) => a.message.localeCompare(b.message))
      .map((c) => ({
        ...c,
        message: c.message
          .replace('<b>', '<b class=" text-white">') // add class to the first bold tag
          .replace(/\n/g, '<br />') // replace new lines with br
          .replace(/\.$/, ''), // remove trailing dot
      }))
      .map((c) => {
        const safeHTML = this._domSanitizer.bypassSecurityTrustHtml(c.message);
        return { ...c, safeHTML };
      });

    const newStuff = changes.filter((c) => c.type === 'new');
    const fixed = changes.filter((c) => c.type === 'fix');
    const improved = changes.filter((c) => c.type === 'improvement');

    return {
      new: newStuff,
      fixed,
      improved,
    };
  }
}
