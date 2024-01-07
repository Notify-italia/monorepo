import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';
import { AppTitleComponent } from '../app-title/app-title.component';

@Component({
  selector: 'notify-loading',
  standalone: true,
  imports: [CommonModule, AppTitleComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() public interval = 400;
  private _rotationFactor = 90;

  public rotationDegrees$: Observable<number> | undefined;

  ngOnInit(): void {
    this.rotationDegrees$ = interval(this.interval).pipe(
      startWith(0),
      map((i) => i * this._rotationFactor + 1)
    );
  }
}
