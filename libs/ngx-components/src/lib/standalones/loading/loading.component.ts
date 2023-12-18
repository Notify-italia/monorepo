import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { interval, map, startWith } from 'rxjs';
import { AppTitleComponent } from '../app-title/app-title.component';

@Component({
  selector: 'notify-loading',
  standalone: true,
  imports: [CommonModule, AppTitleComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  private _rotationFactor = 90;

  public rotationDegrees$ = interval(400).pipe(
    startWith(0),
    map((i) => i * this._rotationFactor + 1)
  );
}
