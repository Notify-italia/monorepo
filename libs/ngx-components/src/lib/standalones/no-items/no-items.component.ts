import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PageLayoutBaseComponent } from '../layout.base.component';

@Component({
  selector: 'notify-no-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-items.component.html',
  styleUrl: './no-items.component.scss',
})
export class NoItemsComponent extends PageLayoutBaseComponent {
  public get subtitleHTML() {
    return this._domSanitizer.bypassSecurityTrustHtml(this.subtitle);
  }

  constructor(private _domSanitizer: DomSanitizer) {
    super();
  }
}
