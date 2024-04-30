import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'notify-google-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit, OnChanges {
  @Input() address = '';
  @Input() mapClass = 'rounded-lg w-full h-full';

  public location$ = new BehaviorSubject<SafeResourceUrl>('');

  constructor(private _domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.parseLocation();
  }

  ngOnChanges(): void {
    this.parseLocation();
  }

  public parseLocation() {
    const locationData = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCC9c9IyxgUS1yZvDg38PXvP2c7FFgLk6s&q=${this.address}&zoom=12
      `;

    const url = this._domSanitizer.bypassSecurityTrustResourceUrl(locationData);

    this.location$.next(url);

    return url;
  }
}
