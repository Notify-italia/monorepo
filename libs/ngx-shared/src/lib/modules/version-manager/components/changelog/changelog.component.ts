import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../../constructors/modal.base.component';
import { UtilsService } from '../../../../services';
import { INotifyVersionInfo } from '../version-label/version-label.component';
@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService, ...baseModalComponentProviders],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
})
export class ChangelogComponent extends ModalBaseComponent implements OnInit {
  @Input() versionInfo!: INotifyVersionInfo;

  override onClose() {
    this._utilsService.toggleScrollLock(false);
  }

  constructor(
    private _domSanitizer: DomSanitizer,
    private _utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit(): void {
    this._utilsService.toggleScrollLock(true);
  }

  public get titleHTML() {
    return this._domSanitizer.bypassSecurityTrustHtml(this.versionInfo.title);
  }

  public get descriptionHTML() {
    return this._domSanitizer.bypassSecurityTrustHtml(
      this.versionInfo.description
    );
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
