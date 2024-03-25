import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'notify-wallpaper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.scss'],
})
export class WallpaperComponent implements OnInit, OnChanges {
  @Input() public config = {
    blur: {
      amount: 10,
      threshold: 1.2,
    },
    scale: {
      min: 0.6,
      max: 1.4,
    },
    evenItemsOffsets: {
      min: 0,
      max: 40,
    },
    oddItemsOffsets: {
      min: 60,
      max: 90,
    },
    cards: 20,
    delay: {
      fastCards: {
        items: 5,
        min: 0,
        max: 4,
      },
      items: {
        min: 0,
        max: 20,
      },
    },
  };

  public listItems: {
    left: string;
    delay: string;
    scale: number;
    blur: number;
  }[] = [];

  public ngOnInit(): void {
    this.listItems = this._renderPage();
  }

  /**
   * The function generates a random number within a given range, with an optional index parameter that
   * scales the randomness.
   * @param {number} min - The minimum value for the random number.
   * @param {number} max - The "max" parameter represents the maximum value that the random number can
   * be.
   * @param {number} [index] - The `index` parameter is an optional parameter that represents the index
   * or position of the random number in a sequence. It is used to scale the random number linearly
   * based on the index value.
   * @returns a random number between the specified minimum and maximum values. If an index is
   * provided, the returned number is scaled linearly with the index but does not exceed the minimum
   * and maximum values.
   */
  public random(min: number, max: number, index?: number): number {
    if (!index) {
      return Math.random() * (max - min) + min;
    }

    //random number that scales lineary with the index but doesn't exceed the min/max values
    return Math.random() * (max - min) + min + (index / 30) * (max - min);
  }

  private _renderPage() {
    return new Array(this.config.cards).fill(0).map((i, index) => {
      const scale = this.random(this.config.scale.min, this.config.scale.max);

      const blur =
        scale > this.config.blur.threshold
          ? (scale - 1) * this.config.blur.amount
          : 0;

      return {
        left: `${
          index % 2
            ? this.random(
                this.config.evenItemsOffsets.min,
                this.config.evenItemsOffsets.max
              )
            : this.random(
                this.config.oddItemsOffsets.min,
                this.config.oddItemsOffsets.max
              )
        }%`,
        delay:
          (index < this.config.delay.fastCards.items
            ? this.random(
                this.config.delay.fastCards.min,
                this.config.delay.fastCards.max,
                index
              )
            : this.random(
                this.config.delay.items.min,
                this.config.delay.items.max,
                index
              )) + 's',
        scale,
        blur,
      };
    });
  }

  public ngOnChanges(): void {
    this.listItems = this._renderPage();
  }
}
