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
  public listItems = new Array(20).fill(0).map((i, index) => {
    const scale = this.random(0.6, 1.4);

    const blur = scale < 1.2 ? 0 : (scale - 1) * 10;

    return {
      left: `${index % 2 ? this.random(0, 40) : this.random(60, 90)}%`,
      delay:
        (index < 5 ? this.random(0, 4, index) : this.random(0, 20, index)) +
        's',
      scale,
      blur,
    };
  });

  public random(min: number, max: number, index?: number): number {
    if (!index) {
      return Math.random() * (max - min) + min;
    }

    //random number that scales lineary with the index but doesn't exceed the min/max values
    return Math.random() * (max - min) + min + (index / 30) * (max - min);
  }
}
