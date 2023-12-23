import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'notify-google-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit, OnChanges {
  @Input() waypoints: (string | undefined)[] = [];
  @Input() origin: string = 'Rome, Italy';
  @Input() destination: string = 'Rome, Italy';
  @Input() mapClass = 'rounded-lg w-full h-full';

  public location$ = new BehaviorSubject<SafeResourceUrl>('');

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.parseLocation();

    this.location$.subscribe((url) => {
      console.log(`url`, url);
    });
  }

  ngOnChanges(): void {
    this.parseLocation();
  }

  public parseLocation() {
    const waypointsParsed = this.waypoints.join('|').split(' ').join('+');

    const locationData = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyCC9c9IyxgUS1yZvDg38PXvP2c7FFgLk6s&origin=${
      this.origin
    }${
      this.waypoints.length ? '&waypoints=' + waypointsParsed : ''
    }&destination=${this.destination}&units=metric&zoom=10
      `;

    const url = this.domSanitizer.bypassSecurityTrustResourceUrl(locationData);

    console.log(url);
    this.location$.next(url);

    return url;
  }
}
