import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'notify-animated-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-bg.component.html',
  styleUrls: ['./animated-bg.component.scss'],
})
export class AnimatedBgComponent {
  public listItems = new Array(30).fill(0).map((i) => ({
    left: this.random(0, 90) + '%',
    delay: this.random(0, 20) + 's',
  }));

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
