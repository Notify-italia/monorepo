import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { format } from 'date-fns';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'notify-mockup-fill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mockup-fill.component.html',
  styleUrls: ['./mockup-fill.component.scss', '../profile.styles.scss'],
})
export class MockupFillComponent {
  public currentTime$ = interval(1000).pipe(
    startWith(0),
    map(() => format(new Date(), 'HH:mm'))
  );
}
